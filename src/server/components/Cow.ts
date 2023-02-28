import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {}

interface CowInstance extends Model {
	Humanoid: Humanoid;
	HumanoidRootPart: Part;
}

@Component({
	tag: "Cow",
})
export class Cow extends BaseComponent<Attributes, CowInstance> implements OnStart {
	private moveToFinishedConnection?: RBXScriptConnection;
	private hungerMeter = 27;
	// private health = 100

	onStart() {
		print("Hello comrade I am cow");
		this.initRandomMovement();
		this.randomMovement();
		this.initHungerTick();
	}

	initRandomMovement() {
		this.moveToFinishedConnection = this.instance.Humanoid.MoveToFinished.Connect(() => {
			if (this.hungerMeter <= 25) {
				this.findGrass();
				//Search for food
			} else {
				this.randomMovement();
			}
		});
		this.randomMovement();
	}

	randomMovement() {
		print("randomMovement");
		const randomLocation = new Vector3(math.random(-100, 100), 0, math.random(-100, 100));
		const viewingPart = new Instance("Part");
		viewingPart.Anchored = true;
		viewingPart.CanCollide = false;
		viewingPart.Size = new Vector3(1, 1, 1);
		viewingPart.Position = randomLocation;
		viewingPart.BrickColor = BrickColor.random();
		viewingPart.Material = Enum.Material.Neon;
		viewingPart.Transparency = 0.5;
		viewingPart.Parent = game.Workspace;

		this.instance.Humanoid.MoveTo(randomLocation);
	}

	//If cow's hunger is 0 the object is killed
	initHungerTick() {
		spawn(() => {
			while (this.hungerMeter > 0) {
				print("Hunger: ", this.hungerMeter);
				this.hungerMeter -= 1;
				wait(1);
				if (this.hungerMeter === 0) {
					this.instance.Destroy();
				}
			}
		});
	}

	findGrass() {
		this.moveToFinishedConnection?.Disconnect();
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

		this.moveToGrass(closestGrass);
	}

	moveToGrass(grass: Part) {
		const testConnection = this.instance.Humanoid.MoveToFinished.Connect(() => {
			this.eatFood(grass);
			testConnection.Disconnect();
			this.hungerMeter = 30;
			this.initRandomMovement();
		});
		this.instance.Humanoid.MoveTo(grass.Position);
	}

	eatFood(grass: Part) {
		grass.Destroy();
	}
}
