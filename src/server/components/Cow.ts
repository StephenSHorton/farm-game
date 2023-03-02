import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Animal, AnimalInstance } from "./Animal";

interface Attributes {}

interface CowInstance extends AnimalInstance {
	Humanoid: Humanoid;
	HumanoidRootPart: Part;
}

@Component({
	tag: "Cow",
})
export class Cow extends BaseComponent<Attributes, CowInstance> implements OnStart {
	private animal: Animal;

	constructor() {
		super();
		this.animal = new Animal(this.instance, {
			animalType: "quadraped",
			hunger: 50,
			health: 300,
			movementSpeed: 10,
			hungerTick: 1,
			behaviorEvents: {
				imHungry: () => this.findGrass(),
			},
		});
	}

	onStart() {
		this.animal.initHungerTick();
	}

	findGrass() {
		const things = game.Workspace.GetChildren();
		const grasses = things.filter((thing) => thing.Name === "Grass") as Part[];

		if (grasses.size() === 0) return;

		let closestGrass: Part = grasses[0];
		grasses.forEach((grass) => {
			const distance = grass.Position.sub(this.instance.HumanoidRootPart.Position).Magnitude;
			const closestDistance = closestGrass.Position.sub(this.instance.HumanoidRootPart.Position).Magnitude;
			if (distance < closestDistance) {
				closestGrass = grass;
			}
		});

		this.animal.moveTo(closestGrass.Position, () => this.eatFood(closestGrass));
	}

	eatFood(grass: Part) {
		grass.Destroy();
		this.animal.setHunger(30);
		this.animal.setIdling(true);
	}
}
