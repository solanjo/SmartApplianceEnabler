/*
 * Copyright (C) 2022 Axel Müller <axel.mueller@avanux.de>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UntypedFormGroup, Validators} from '@angular/forms';
import {Logger} from '../../log/logger';
import {TranslateService} from '@ngx-translate/core';
import {ErrorMessageHandler} from '../../shared/error-message-handler';
import {FormHandler} from '../../shared/form-handler';
import {ErrorMessages} from '../../shared/error-messages';
import {ERROR_INPUT_REQUIRED, ErrorMessage, ValidatorType} from '../../shared/error-message';
import {InputValidatorPatterns} from '../../shared/input-validator-patterns';
import {getValidInt} from '../../shared/form-util';
import {SwitchOption} from './switch-option';

@Component({
  selector: 'app-control-switchoption',
  templateUrl: './control-switchoption.component.html',
  styleUrls: ['./control-switchoption.component.scss']
})
export class ControlSwitchOptionComponent implements OnChanges, OnInit {
  @Input()
  switchOption: SwitchOption;
  @Input()
  form: UntypedFormGroup;
  formHandler: FormHandler;
  errors: { [key: string]: string } = {};
  errorMessages: ErrorMessages;
  errorMessageHandler: ErrorMessageHandler;

  constructor(private logger: Logger,
              private translate: TranslateService
  ) {
    this.errorMessageHandler = new ErrorMessageHandler(logger);
    this.formHandler = new FormHandler();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.switchOption) {
      if (changes.switchOption.currentValue) {
        this.switchOption = changes.switchOption.currentValue;
      } else {
        this.switchOption = new SwitchOption();
      }
      this.expandParentForm();
    }
    if (changes.form) {
      this.expandParentForm();
    }
  }

  ngOnInit() {
    this.errorMessages = new ErrorMessages('ControlSwitchOptionComponent.error.', [
      new ErrorMessage('powerThreshold', ValidatorType.pattern),
      new ErrorMessage('powerThreshold', ValidatorType.required, ERROR_INPUT_REQUIRED, true),
      new ErrorMessage('switchOnDetectionDuration', ValidatorType.pattern),
      new ErrorMessage('switchOnDetectionDuration', ValidatorType.required, ERROR_INPUT_REQUIRED, true),
      new ErrorMessage('switchOffDetectionDuration', ValidatorType.pattern),
      new ErrorMessage('switchOffDetectionDuration', ValidatorType.required, ERROR_INPUT_REQUIRED, true),
    ], this.translate);
    this.form.statusChanges.subscribe(() => {
      this.errors = this.errorMessageHandler.applyErrorMessages(this.form, this.errorMessages);
    });
  }

  expandParentForm() {
    this.formHandler.addFormControl(this.form, 'powerThreshold',
      this.switchOption && this.switchOption.powerThreshold,
      [Validators.required, Validators.pattern(InputValidatorPatterns.INTEGER)]);
    this.formHandler.addFormControl(this.form, 'switchOnDetectionDuration',
      this.switchOption && this.switchOption.switchOnDetectionDuration,
      [Validators.required, Validators.pattern(InputValidatorPatterns.INTEGER)]);
    this.formHandler.addFormControl(this.form, 'switchOffDetectionDuration',
      this.switchOption && this.switchOption.switchOffDetectionDuration,
      [Validators.required, Validators.pattern(InputValidatorPatterns.INTEGER)]);
  }

  updateModelFromForm(): SwitchOption {
    const powerThreshold = getValidInt(this.form.controls.powerThreshold.value);
    const switchOnDetectionDuration = getValidInt(this.form.controls.switchOnDetectionDuration.value);
    const switchOffDetectionDuration = getValidInt(this.form.controls.switchOffDetectionDuration.value);

    // all properties are optional; therefore we always have to return an instance

    this.switchOption.powerThreshold = powerThreshold ?? null;
    this.switchOption.switchOnDetectionDuration = switchOnDetectionDuration ?? null;
    this.switchOption.switchOffDetectionDuration = switchOffDetectionDuration ?? null;
    return this.switchOption;
  }
}
