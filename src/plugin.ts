import streamDeck from "@elgato/streamdeck";

import { OpenUrlAction } from "./actions/open-url";
import {
	TeamsCameraAction,
	TeamsMuteAction,
	TeamsRaiseHandAction,
} from "./actions/teams-toggle";

streamDeck.logger.setLevel("info");

streamDeck.actions.registerAction(new TeamsMuteAction());
streamDeck.actions.registerAction(new TeamsCameraAction());
streamDeck.actions.registerAction(new TeamsRaiseHandAction());
streamDeck.actions.registerAction(new OpenUrlAction());

streamDeck.connect();
