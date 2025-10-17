import { Component, Input, OnInit } from "@angular/core";
import { Step } from "./step.interface";

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @Input() steps: Step[] = [];
  @Input() initialStep = 0;

  currentStepIndex = 0;

  ngOnInit() {
    this.currentStepIndex = this.initialStep;
  }

  goToStep(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex = index;
    }
  }

  nextStep() {
    this.goToStep(this.currentStepIndex + 1);
  }

  previousStep() {
    this.goToStep(this.currentStepIndex - 1);
  }
}
