import { Networking } from "@flamework/networking";

interface ServerEvents {
	plantSeed(seed: string, plantPlot: Instance): void;
}

interface ClientEvents {}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
