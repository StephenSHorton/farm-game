import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Events } from "server/network";

interface Attributes {}

@Component({
	tag: "PlantPlot",
})
export class PlantPlot extends BaseComponent<Attributes> implements OnStart {
	private plant?: "Tomato" | "Corn";

	onStart() {
		this.setupEvents();
	}

	setupEvents() {
		//TODO - make sure seed doesn't get destroyed if plant plot is occupied
		Events.plantSeed.connect((_, seed, plantPlot) => {
			if (this.plant) return;
			print("Seed planted", seed, plantPlot);
			switch (seed) {
				case "TomatoSeed":
					this.plant = "Tomato";
					break;
				case "CornSeed":
					this.plant = "Corn";
					break;
			}
		});
	}
}
