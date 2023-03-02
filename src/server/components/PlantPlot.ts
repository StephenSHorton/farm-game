import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Events } from "server/network";

const ServerStorage = game.GetService("ServerStorage");
const plantsFolder = ServerStorage.WaitForChild("Plants");
const plantInstances = {
	Tomato: plantsFolder.WaitForChild("Tomato") as Plant,
};

interface Plant extends Model {
	PrimaryPart: MeshPart;
}

interface Attributes {}

interface PlantPlotInstance extends Model {
	PrimaryPart: Part;
}

@Component({
	tag: "PlantPlot",
})
export class PlantPlot extends BaseComponent<Attributes, PlantPlotInstance> implements OnStart {
	private isPlanted = false;
	private plantInstance?: Plant;

	onStart() {
		this.setupEvents();
	}

	setupEvents() {
		//TODO - make sure seed doesn't get destroyed if plant plot is occupied
		Events.plantSeed.connect((_player, seed, plantPlot) => {
			print(plantPlot !== this.instance);
			if (this.isPlanted || plantPlot !== this.instance) return;
			this.isPlanted = true;

			switch (seed) {
				case "TomatoSeed":
					this.plantInstance = plantInstances.Tomato.Clone();
					this.plantInstance.PrimaryPart.PivotTo(this.instance.PrimaryPart.CFrame);
					this.plantInstance.Parent = this.instance;
					break;
				// case "CornSeed":
				// 	this.plant = "Corn";
				// 	break;
			}
		});
	}
}
