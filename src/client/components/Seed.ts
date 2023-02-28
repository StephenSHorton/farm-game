import { Dependency, OnStart } from "@flamework/core";
import { Component, BaseComponent, Components } from "@flamework/components";
import { Events } from "client/network";

const Players = game.GetService("Players");

interface Attributes {}

interface SeedInstance extends Tool {
	Handle: Part;
}

@Component({
	tag: "Seed",
})
export class Seed extends BaseComponent<Attributes, SeedInstance> implements OnStart {
	private mouse: Mouse;
	private activatedConnection?: RBXScriptConnection;

	constructor() {
		super();
		this.mouse = Players.LocalPlayer.GetMouse();
	}

	onStart() {
		this.setupSeed();
	}

	setupSeed() {
		const seed = this.instance;
		this.activatedConnection = seed.Activated.Connect(() => this.plantSeed());
	}

	plantSeed() {
		const target = this.mouse.Target;
		if (!target || target.Name !== "Dirt") return;
		const plantPlot = target.Parent;
		if (!plantPlot || plantPlot.Name !== "PlantPlot") return;

		Events.plantSeed(this.instance.Name, plantPlot);
		this.cleanUp();
	}

	cleanUp() {
		this.activatedConnection?.Disconnect();
		this.instance.Destroy();
		this.destroy();
	}
}
