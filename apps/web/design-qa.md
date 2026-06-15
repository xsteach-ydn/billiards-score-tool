**Findings**
- No actionable P0/P1/P2 findings remain.

**Open Questions**
- None for this prototype pass. Import/export placement intentionally differs from the original generated references because the user clarified that import/export is global backup/restore, while sharing is per-activity.

**Implementation Checklist**
- Home uses the selected activity-ledger direction with history, active/ended filters, search, quick continue, and home-level data management.
- Scoring uses the selected fast-entry direction with current totals, per-player steppers, quick score buttons, real-time zero-sum validation, auto-fill last player, round time, and recent rounds.
- Settlement uses the selected result-sharing direction with default 1 point = 5 yuan, final ranking, transfer suggestions, copy-to-WeChat sharing, and continue-scoring action.
- Global backup/restore is in home-level data management. Single-activity sharing is in the activity/settlement flow.
- View changes reset scroll position so navigation from a scrolled list does not hide page headers.

**Follow-up Polish**
- P3: Long activity names are intentionally truncated in the compact topbar. A future pass could add a title expansion affordance if real names are often longer.
- P3: Round rows show compact inline scores and may require horizontal scrolling for 6-7 player rounds. This is acceptable for the current mobile-first prototype but could be made denser in a later pass.

source visual truth path:
- /Users/dane/.codex/generated_images/019eb973-646a-7950-a163-f6d72630b0d3/ig_07e2b82c29a1c086016a2b674b29248191acb8b4c2e4975db4.png
- /Users/dane/.codex/generated_images/019eb973-646a-7950-a163-f6d72630b0d3/ig_07e2b82c29a1c086016a2b66fc1f188191a3bc8d6486021272.png
- /Users/dane/.codex/generated_images/019eb973-646a-7950-a163-f6d72630b0d3/ig_07e2b82c29a1c086016a2b67a2d6088191a00193ce7975d3b6.png

implementation screenshot path:
- /Users/dane/Documents/日常工具/pool-score-prototype/qa-screenshots/implementation-home.png
- /Users/dane/Documents/日常工具/pool-score-prototype/qa-screenshots/implementation-activity.png
- /Users/dane/Documents/日常工具/pool-score-prototype/qa-screenshots/implementation-settlement.png

viewport:
- 390 x 844

state:
- Home: activity ledger with all-filter selected.
- Activity: active scoring flow with default zero-value round draft.
- Settlement: active activity result converted into settlement view.

full-view comparison evidence:
- Home implementation matches the selected ledger direction: search, status filters, activity rows/cards, compact player score preview, default rate display, and primary create action.
- Activity implementation matches the selected fast-entry direction: current total board, time-stamped round entry, steppers, quick score buttons, zero-sum validation, and recent records.
- Settlement implementation matches the selected settlement direction: final ranking, money conversion, transfer suggestions, copy-to-WeChat action, and continue-scoring action.

focused region comparison evidence:
- Focused region pass was not separately needed because the visible surfaces are native UI controls, text rows, and lucide icons rather than custom raster assets; the viewport captures show the required hierarchy, spacing, semantic colors, and copy.

required fidelity surfaces:
- Fonts and typography: Uses a mobile product type stack with Chinese system fonts, readable 13-25px scale, tabular numeric scores, and no negative letter spacing.
- Spacing and layout rhythm: Uses one grouped mobile surface per major task, 8px radii, lightweight dividers, and stable row/grid dimensions for score controls.
- Colors and visual tokens: Uses neutral white/gray base, green for positive/action, red for negative, and distinct player colors without a one-note palette.
- Image quality and asset fidelity: No custom image assets are required for the implemented prototype. Icons come from lucide-react.
- Copy and content: Chinese UI copy reflects the clarified product model: global data backup/restore, per-activity sharing, 3-7 players, default 1 point = 5 yuan, match time, and zero-sum scoring.

patches made since previous QA pass:
- Added scroll-to-top on view changes after QA found hidden headers when navigating from a scrolled home list.
- Changed home section heading from a static "继续进行中" to a filter-aware title.
- Corrected initial entry hint so an all-zero draft does not claim it can be saved while the button is disabled.
- Increased match-time input width to prevent clipping.

final result: passed
