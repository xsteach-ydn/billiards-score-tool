# Prototype Instructions

This frontend app lives at `apps/web` in the `billiards-score-tool` repository. Keep changes compatible with the planned multi-app layout: future backend code should live under `apps/api`, and shared domain rules/types should live under `packages/shared`.

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Current Prototype Decisions

- Use the activity-ledger home structure, fast in-session score entry, and settlement/share result layout from the selected Product Design directions.
- Import/export is global backup and restore for all records, placed under home-level data management.
- Sharing is scoped to one activity result, with options for summary, full details, and money visibility.
- Money conversion defaults to 1 point = 5 yuan, with activity-level settings.
- New activity recent-player chips are sourced from historical activities and should overwrite the currently focused player-name input.
- Round entry time should stay synced to the current time while the score draft is empty, then respect manual edits once the user changes the time.
- Home activity duration should be calculated from activity start/end timestamps, not hardcoded sample text.
