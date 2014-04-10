// Add trim function to String for IE >=8.
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

// Apply functionality when document ready.
$(function() {
  $("#em-slider").slider({
    value: -5.9,
	min: -8.25,
	max: 6.2,
	step: 0.00001,
	animate: 'slow',
	slide: function(event, ui) {
	  $('#frequency-input').val(freqAutoRange(calcFreqFromeV(Math.pow(10, ui.value))));
	  $('#wavelength-input').val(wavelengthAutoRange(calcWavelength(calcFreqFromeV(Math.pow(10, ui.value)))));
	  $('#energy-input').html(getScientificNotation(electronVoltsToJoules(Math.pow(10, ui.value))) + ' J');
      $('#frequency-converted').html(getScientificNotation(calcFreqFromeV(Math.pow(10, ui.value))));
      $('#wavelength-converted').html(getScientificNotation(calcWavelength(calcFreqFromeV(Math.pow(10, ui.value)))));
	}
  });

  $('#em-slider .ui-slider-handle').html('<div id="energy-input"></div>');

  $('#wavelength-input').change(function() {
	printWavelengthCalcFreq();
  });

  $('#wavelength-units').change(function() {
	printWavelengthCalcFreq();
  });

  $('#frequency-input').change(function() {
	printFreqCalcWavelength();
  });

  $('#frequency-units').change(function() {
	printFreqCalcWavelength();
  });

  $('#wavelength-input').val('1');
  $('#wavelength-input').change();

  function printWavelengthCalcFreq() {
	var wavelengthInput = 0;
	var wlInputStr = $('#wavelength-input').val();
    $('#frequency-converted').html('');

    if ((!isNaN(wlInputStr)) && (wlInputStr.trim() !== '')) {
	  wavelengthInput = parseFloat($('#wavelength-input').val()) * parseFloat($('#wavelength-units').val());
	  if (wavelengthInput > 221.06) {
		wavelengthInput = 221.06;
		$('#wavelength-input').val('221.06');
		$('#wavelength-units').val('1');
	  }
	  else if (wavelengthInput < 0.78436e-12) {
		wavelengthInput = 0.78436e-12;
		$('#wavelength-input').val('0.78436');
		$('#wavelength-units').val('0.000000000001');
	  }

      $('#wavelength-converted').html(getScientificNotation(wavelengthInput));
      $('#frequency-converted').html(getScientificNotation(calcFreq(wavelengthInput)));
      $('#frequency-input').val(freqAutoRange(calcFreq(wavelengthInput)));
      $('#em-slider').slider('value', getSliderVal(joulesToElectronVolts(calcEnergy(calcFreq(wavelengthInput)))));
      $('#energy-input').html(getScientificNotation(calcEnergy(calcFreq(wavelengthInput))) + ' J');
    }
    else {
	  $('#frequency-input').val('');
	  $('#wavelength-converted').html('');
	  $('#energy-input').html('');
    }
  }

  function printFreqCalcWavelength() {
	var frequencyInput = 0;
	var freqInputStr = $('#frequency-input').val();
    $('#wavelength-converted').html('');

    if ((!isNaN(freqInputStr)) && (freqInputStr.trim() !== '')) {
	  frequencyInput = parseFloat($('#frequency-input').val()) * parseFloat($('#frequency-units').val());
	  if (frequencyInput > 382.48e18) {
		frequencyInput = 382.48e18;
		$('#frequency-input').val('382480000');
		$('#frequency-units').val('1000000000000');
	  }
	  else if (frequencyInput < 1.3571e6) {
		frequencyInput = 1.3571e6;
		$('#frequency-input').val('1.3571');
		$('#frequency-units').val('1000000');
	  }
	
      $('#frequency-converted').html(getScientificNotation(frequencyInput));
      $('#wavelength-converted').html(getScientificNotation(calcWavelength(frequencyInput)));
      $('#wavelength-input').val(wavelengthAutoRange(calcWavelength(frequencyInput)));
      $('#em-slider').slider('value', getSliderVal(joulesToElectronVolts(calcEnergy(frequencyInput))));
      $('#energy-input').html(getScientificNotation(calcEnergy(frequencyInput)) + ' J');
    }
    else {
	  $('#wavelength-input').val('');
	  $('#frequency-converted').html('');
	  $('#energy-input').html('');
    }
  }

  function calcFreq(wl) {
	return (3e8 / wl);
  }

  function calcFreqFromeV(ev) {
    return (electronVoltsToJoules(ev) / 6.63e-34);
  }

  function calcEnergy(freq) {
	return (6.63e-34 * freq);
  }

  function joulesToElectronVolts(joules) {
    return (joules / 1.6e-19);
  }

  function electronVoltsToJoules(ev) {
    return (ev * 1.6e-19);	
  }

  function calcWavelength(freq) {
    return (3e8 / freq);
  }

  function getScientificNotation(input) {
	var splitInput = input.toExponential(2).toString().split('e');
	splitInput[1] = splitInput[1].replace('+', '');

    var scientificInput = splitInput[0] + '&times;10<sup>' + splitInput[1] + '</sup>';

    return scientificInput;
  }

  function getSliderVal(input) {
	return (Math.log(input) / Math.log(10)).toFixed(5);
  }

  function freqAutoRange(freq) {
	var freqDisplay = 0;
	var freqExp = freq.toExponential();
	var freqExpSplit = freqExp.split('e');
	var freqCoef = parseFloat(freqExpSplit[0]);
	var freqExponent = parseInt(freqExpSplit[1]);
	
	if (freqExponent >= 12) {
		$('#frequency-units').val('1000000000000');
		freqDisplay = freq / 1000000000000;
	}
	else if (freqExponent >= 9) {
		$('#frequency-units').val('1000000000');
		freqDisplay = freq / 1000000000;
	}
	else if (freqExponent >= 6) {
		$('#frequency-units').val('1000000');
		freqDisplay = freq / 1000000;
	}
	else if (freqExponent >= 3) {
		$('#frequency-units').val('1000');
		freqDisplay = freq / 1000;
	}
	else {
		$('#frequency-units').val('1');
		freqDisplay = freq / 1;
	}
	
	return parseFloat(freqDisplay.toPrecision(4));
  }

  function wavelengthAutoRange(wl) {
	var wlDisplay = 0;
	var wlExp = wl.toExponential();
	var wlExpSplit = wlExp.split('e');
	var wlCoef = parseFloat(wlExpSplit[0]);
	var wlExponent = parseInt(wlExpSplit[1]);

	if (wlExponent <= -12) {
		$('#wavelength-units').val('0.000000000001');
		wlDisplay = wl / 0.000000000001;
	}
	else if (wlExponent <= -9) {
		$('#wavelength-units').val('0.000000001');
		wlDisplay = wl / 0.000000001;
	}
	else if (wlExponent <= -6) {
		$('#wavelength-units').val('0.000001');
		wlDisplay = wl / 0.000001;
	}
	else {
		$('#wavelength-units').val('1');
		wlDisplay = wl;
	}

	return parseFloat(wlDisplay.toPrecision(4));
  }
});