import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Animal, AnimalInstance } from "./Animal";

interface Attributes {}

interface PigInstance extends AnimalInstance {}

@Component({
	tag: "Pig",
})
export class Pig extends BaseComponent<Attributes, PigInstance> implements OnStart {
	constructor() {
		super();

		new Animal(this.instance, {
			animalType: "quadraped",
			hunger: 100,
			health: 100,
			movementSpeed: 2,
			hungerTick: 1,
		});
	}

	onStart() {
		// print("Hello comrade I am pig");
	}
}
