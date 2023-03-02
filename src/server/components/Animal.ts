const Debris = game.GetService("Debris");

type BehaviorEvents = {
	imHungry: () => void;
};

type AnimalDetails = {
	name?: string; // TODO - find out if we need this here
	hunger: number;
	hungerTick: number;
	health: number;
	movementSpeed: number;
	animalType: AnimalType;
	behaviorEvents?: BehaviorEvents;
};

type AnimalType = "bipedal" | "quadraped" | "crawling" | "flying";

export interface AnimalInstance extends Model {
	Humanoid: Humanoid;
	HumanoidRootPart: Part;
}

export class Animal {
	private instance: AnimalInstance;
	private animalDetails: AnimalDetails;
	private moveToFinishedConnection?: RBXScriptConnection;
	private idling = true;
	private imHungry = false;

	constructor(instance: AnimalInstance, animalDetails: AnimalDetails) {
		this.instance = instance;
		this.animalDetails = animalDetails;

		this.init();
	}

	init() {
		this.initAnimalDetails();
		this.initMovement();
		this.initHealthMaitinence();
	}

	setHunger(value: number) {
		this.animalDetails.hunger = value;
	}

	getHunger() {
		return this.animalDetails.hunger;
	}

	setIdling(idle: boolean) {
		this.idling = idle;
		if (idle) {
			this.initMovement();
		}
	}

	initAnimalDetails() {
		const humanoid = this.instance.Humanoid;
		humanoid.WalkSpeed = this.animalDetails.movementSpeed;
		humanoid.Health = this.animalDetails.health;
	}

	interact() {
		print("interact not implemented");
		/**
		 * TODO - Feeding
		 * TODO - Produce
		 */
	}

	initHealthMaitinence() {
		print("initHealthMaitinence not implemented");
		this.initHungerTick();

		// Explodes the animal on death
		this.instance.Humanoid.Died.Connect(() => {
			const explosion = new Instance("Explosion");
			explosion.Position = this.instance.HumanoidRootPart.Position;
			explosion.Parent = this.instance;
			Debris.AddItem(this.instance, 3);
		});

		/**
		 * TODO - Init health behavior (sickness, death, etc events...)
		 */
	}

	initHungerTick() {
		spawn(() => {
			while (this.animalDetails.hunger > 0) {
				print("Hunger: ", this.animalDetails.hunger);
				this.animalDetails.hunger -= this.animalDetails.hungerTick;
				wait(1);
				if (this.animalDetails.hunger <= 100 * 0.25) {
					this.idling = false;
					this.imHungry = true;
				}
				if (this.animalDetails.hunger === 0) {
					this.instance.Humanoid.Health = 0; // Kills the animal
					break;
				}
			}
		});
	}

	initMovement() {
		//! fix dis gae boomoo moving
		this.idling = true;
		const connection = this.instance.Humanoid.MoveToFinished.Connect(() => {
			connection?.Disconnect();
			if (!this.idling) {
				if (this.imHungry) {
					this.animalDetails.behaviorEvents?.imHungry && this.animalDetails.behaviorEvents?.imHungry();
				}
				return;
			}
			this.randomMovement();
		});

		spawn(() => {
			this.randomMovement();
		});
	}

	randomMovement() {
		// General movement behavior to make the animal appear alive
		const viewingPart = new Instance("Part");
		viewingPart.Anchored = true;
		viewingPart.CanCollide = false;
		viewingPart.Size = new Vector3(1, 1, 1);
		viewingPart.BrickColor = BrickColor.random();
		viewingPart.Material = Enum.Material.Neon;
		viewingPart.Shape = Enum.PartType.Ball;
		viewingPart.Transparency = 0.5;

		Debris.AddItem(viewingPart, 3);

		// Move to a random location that is within 15 units of the animal
		const currentLocation = this.instance.HumanoidRootPart.Position;
		const randomLocation = new Vector3(
			math.random(currentLocation.X - 15, currentLocation.X + 15),
			0,
			math.random(currentLocation.Z - 15, currentLocation.Z + 15),
		);

		viewingPart.Position = randomLocation;
		viewingPart.Parent = game.Workspace;

		this.instance.Humanoid.MoveTo(randomLocation);
	}

	moveTo(position: Vector3, callback?: () => void) {
		this.idling = false;
		this.moveToFinishedConnection = this.instance.Humanoid.MoveToFinished.Connect(() => {
			this.moveToFinishedConnection?.Disconnect();
			this.moveToFinishedConnection = undefined;
			callback?.();
		});
		this.instance.Humanoid.MoveTo(position);
	}
}
