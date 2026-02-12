# Projects & Sessions

## Data Model

```
ProjectID
 └─ ProjectDirectory (basedir/root)
     └─ Directory (active/worktree)
     └─ Session (root)
         └─ Session (child)  ← subagent sessions
```

### ProjectDirectory

The project root directory, selected via the top-left dropdown. Typically the root of a git repository.

- Example: `/home/user/prog/vis`
- The API exposes this as `ProjectInfo.worktree`, which is a misleading field name.

### Directory

The working directory, selected via the middle dropdown. Either the ProjectDirectory itself or a git worktree path.

- Example: `/home/user/prog/vis`, `/home/user/.local/share/opencode/worktree/.../neon-canyon`
- Passed to the API as `?directory=` query parameter or `x-opencode-directory` header.
- May map to one or more projectIDs as candidate contexts.
- Use it as runtime context, not as an authoritative project identity.

### ProjectID

An identifier assigned by OpenCode to each project (SHA hash string).

- Example: `95c06a8380e966d762e14efc434b1111b7169ab7`
- Maps to one authoritative project root directory (`projectDirectory`).

### Session

A conversation session belonging to a specific directory (= projectID).

- Sessions without a `parentID` are **root sessions**, shown in the top-right session list.
- Sessions with a `parentID` are **child sessions**, created by subagents.

## API and Directory

Most API calls require a `?directory=` parameter or `x-opencode-directory` header to specify the directory. Without it, the server defaults to its startup working directory, which is not robust.

### Resolving ProjectID

`GET /project` returns all projects, but the `ProjectInfo.worktree` field is **unreliable** — multiple projectIDs can share the same worktree value.

To resolve project context from a directory, use these runtime APIs:

| API | Purpose |
|-----|---------|
| `GET /project/current?directory=X` | Returns the active project context for that directory |
| `GET /session?directory=X` | Returns sessions scoped by directory with their `projectID` |

Data from `/project` should be used to build project root candidates (`projectDirectory`), especially from `worktree`.

### Enumerating Candidate Directories

A single ProjectDirectory may have multiple directories (worktrees):

- The ProjectDirectory itself (`ProjectInfo.worktree`)
- Git worktrees (`GET /experimental/worktree?directory=X`)
- Sandboxes (`ProjectInfo.sandboxes[]`)

These lists come from the `/project` and `/experimental/worktree` APIs.

## SSE Events

`GET /global/event` delivers events across all projects in a single stream.

Session-related events:

| Event | Key Fields |
|-------|-----------|
| `session.updated` | `info.id`, `info.projectID`, `info.directory`, `info.title`, `info.time` |
| `session.status` | `sessionID`, `status.type` (`busy` / `idle` / `retry`) |
| `session.deleted` | `sessionID` |
| `project.updated` | `id`, `worktree`, `sandboxes[]` — worktree/sandboxes may be polluted |

`session.updated` events carry `projectID` and `directory`, making them suitable for candidate indexing and runtime session graph updates.

`project.updated` data can update project root metadata (`projectId -> projectDirectory`), but should not force a strict reverse one-to-one mapping.

## Session Graph (sessionGraph)

`app/utils/sessionGraph.ts` is the **single source of truth (SSOT)** for:
- All known sessions and their hierarchy
- Project metadata (worktrees, sandboxes)
- Worktree lists per project root
- VCS branch information per directory
- Session status (busy/idle/retry)

### Nodes

Each session is stored as a `SessionNode`:

| Field | Description |
|-------|-------------|
| `sessionID` | Session ID (`ses_...`) |
| `projectID` | Owning projectID |
| `directory` | Owning directory |
| `parentID` | Parent session ID (`undefined` for root sessions) |
| `retention` | `persistent` (normal) or `ephemeral` (temporary subagent sessions) |

### Mapping

Mapping is modeled in two layers:

- `directoryByProjectID`: `projectID -> projectDirectory` (authoritative)
- `projectIDsByDirectory`: `directory -> projectID[]` (candidate index; may be ambiguous)

Use `setProjectDirectory(projectID, directory)` for the authoritative forward mapping and candidate-index updates for reverse lookup.

### Computed State in App.vue

The following are **computed from the graph** and update reactively:

| Computed | Source | Purpose |
|----------|--------|---------|
| `projects` | `sessionGraphStore.getProjects()` | All known projects with worktrees/sandboxes |
| `worktrees` | `sessionGraphStore.getWorktrees(projectDirectory)` | Worktree list for selected project |
| `worktreeMetaByDir` | `sessionGraphStore.getVcsInfo(dir)` for each worktree | VCS branch info per directory |

### Writable Refs in App.vue

These remain **writable refs** for UI state:

| Ref | Purpose |
|-----|---------|
| `selectedProjectId` | User's selected project (may be empty) |
| `activeDirectory` | User's selected worktree/directory |
| `selectedSessionId` | User's selected session |
| `projectDirectory` | User's selected project root |

### Session Fetching Flow

```
1. collectProjectWorktreeDirectories()    ← enumerate candidate directories
2. bootstrapSessionGraph(directories)     ← for each directory:
   a. fetchCurrentProject(directory)      ← resolve correct projectID
   b. setProjectDirectory(projectID, dir) ← establish project root mapping
   c. listSessions(?directory=X)          ← fetch session list
   d. upsertSessions(sessions)            ← register in graph
3. SSE events                             ← real-time updates
   a. session.updated → upsertSession + add directory/project candidate link
   b. session.status  → status update
```

### Watcher Architecture

Replaced the previous cascade of watchers with **focused atomic watchers**:

- `watch(activeDirectory)` → fetch worktree metadata, reload todos
- `watch(selectedSessionId)` → restore composer draft, reload todos
- `watch(projectDirectory)` → fetch worktrees, update graph
- `watch(sessionGraphVersion)` → trigger computed updates (projects, worktrees, etc.)

Each watcher is independent and handles a single concern, avoiding cascading side effects.
