import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Teams app bundle ids to try (desktop / Store variants).
 */
const TEAMS_BUNDLE_IDS = [
	"com.microsoft.teams2",
	"com.microsoft.teams",
] as const;

/**
 * Sends a Teams keyboard shortcut via AppleScript on macOS:
 * remember frontmost app → activate Teams → keystroke → restore previous app.
 *
 * Requires Automation permission for Stream Deck / osascript on first use.
 */
export async function runTeamsHotkey(key: string, usingCommandShift = true): Promise<void> {
	if (process.platform !== "darwin") {
		throw new Error("Teams hotkeys are only supported on macOS.");
	}

	const modifiers = usingCommandShift ? "command down, shift down" : "command down";
	const script = `
tell application "System Events"
	set frontApp to name of first application process whose frontmost is true
end tell

set teamsActivated to false
repeat with bid in {${TEAMS_BUNDLE_IDS.map((id) => `"${id}"`).join(", ")}}
	try
		tell application id bid to activate
		set teamsActivated to true
		exit repeat
	end try
end repeat

if teamsActivated is false then
	error "Microsoft Teams is not installed or could not be activated"
end if

delay 0.15

tell application "System Events"
	keystroke "${escapeAppleScriptString(key)}" using {${modifiers}}
end tell

delay 0.05

try
	tell application frontApp to activate
end try
`;

	await execFileAsync("/usr/bin/osascript", ["-e", script], {
		timeout: 10_000,
		maxBuffer: 1024 * 1024,
	});
}

function escapeAppleScriptString(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
