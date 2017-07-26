var active = false
var original_state = []
var layers = []

function onRun(context) {
  var app = [NSApplication sharedApplication]

  active = !active

  if (active) {
    var selection = context.selection;

    var artboard = null
    if (selection.count() > 0) {
      if (selection[0].class() == "MSArtboardGroup") {
        artboard = selection[0]
      }
    }

    if (artboard == null) {
      [app displayDialog:"Please select an artboard to see simulation." withTitle:"Select Artboard"]
      active = false
      return
    }

    layers = artboard.layers()
    original_state = []
    traverseLayers(layers, saveState)

    coscript.setShouldKeepAround(true);
    coscript.scheduleWithRepeatingInterval_jsFunction(0.1, function(interval) {
      if (!active) {
        interval.cancel()
        traverseLayers(layers, restoreState)
      }
      else {
        traverseLayers(layers, shuffle_layer)
      }
    })
  }
}

function traverseLayers(layers, action) {
  for (var i = 0; i < layers.count(); i++) {
    var layer = layers.objectAtIndex(i)

    if (layer.isKindOfClass(MSTextLayer)) {
      action(layer)
    }

    if (layer.layers != undefined) {
      traverseLayers(layer.layers(), action)
    }
  }
}

function saveState(layer) {
  original_state.push(layer.stringValue())
}

function restoreState(layer) {
  var val = original_state.shift()
  layer.setStringValue(val)
}

function shuffle_layer(layer) {
  var text = layer.stringValue()
  layer.setStringValue(shuffle_text(text))
}

function shuffle_text(text) {
  var words = text.split(" ")

  var new_words = []
  for (var i = 0; i < words.length; i++) {
    var word = words[i]
    if (Math.random() <= 1) {
      new_word = shuffle_word(word)
      new_words.push(new_word)
    }
    else {
      new_words.push(word)
    }
  }

  return new_words.join(" ")
}

function shuffle_word(word) {
  var shuffled_word = ""
  old_idx = randInt(1, word.length - 1)
  new_idx = randInt(1, word.length - 1)

  var old_char = word.charAt(old_idx)
  var new_char = word.charAt(new_idx)
  for (var i = 0; i < word.length; i++) {
    if (i == old_idx) {
      shuffled_word += new_char
    }
    else if (i == new_idx) {
      shuffled_word += old_char
    }
    else {
      shuffled_word += word.charAt(i)
    }
  }

  return shuffled_word
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function removeAt(str, idx) {
  return str.slice(0, idx) + str.slice(idx + 1)
}
