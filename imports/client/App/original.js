export default (function () {
  const load = () => {
    const table = [
      0x80, 0x8000, 0x4000, 0x2000, 0x1000,
      0x800, 0x400, 0x200, 0x100, 0x800000,
      0x400000, 0x200000, 0x100000, 0x80000, 0x40000,
      0x20000, 0x10000, 0x80000000, 0x40000000, 0x20000000,
      0x10000000, 0x8000000, 0x4000000, 0x2000000, 0x1000000
    ]

    const ChipCodec = {
      encode (chip, color) {
        let echip = color
        let p = 0
        const size = table.length

        while (p < size) {
          const mask = table[p]
          const pixel = chip[p]

          if (pixel) {
            echip |= mask
          }

          p += 1
        }

        return echip
      },

      decode (echip) {
        const chip = []
        const size = table.length
        let p = 0

        while (p < size) {
          const mask = table[p]
          const pixel = echip & mask

          chip[p] = pixel
            ? 1
            : 0
          p += 1
        }

        const color = echip ^ (echip & 0xFFFFFF80)

        return {
          chip,
          color
        }
      }
    }

    const colors = [
      'black',
      'white',
      'red',
      'cyan',
      'violet',
      'green',
      'blue',
      'yellow',
      'orange',
      'brown',
      'lightred',
      'darkgrey',
      'lightgrey',
      'lightgreen',
      'lightblue',
      'lightergrey'
    ]

    const hex32 = n => {
      if (n < 0) {
        n = 0xFFFFFFFF + n + 1
      }
      const hex = Number(n).toString(16)
      return `${'00000000'.substr(0, 8 - hex.length)}${hex}`.toUpperCase()
    }

    let selectedChip = 0

    let selectedColor = 1
    let encodedChipDocument = selectedColor
    let chipDocumentName = ''

    const root = document.querySelector('.root')

    const encodedChipContainer = document.createElement('div')
    const encodedChipNameField = document.createElement('input')
    const encodedChipValue = document.createElement('div')

    encodedChipContainer.classList.add('encoded-chip__container')
    encodedChipNameField.classList.add('encoded-chip__name-field-input')
    encodedChipValue.classList.add('encoded-chip__value')

    encodedChipValue.innerText = `0x${hex32(encodedChipDocument)}`
    encodedChipNameField.placeholder = 'Untitled Chip'

    encodedChipContainer.appendChild(encodedChipNameField)
    encodedChipContainer.appendChild(encodedChipValue)

    encodedChipNameField.addEventListener('change', event => {
      const { target = {} } = event
      const { value = '' } = target

      chipDocumentName = `${value}`
    }, false)

    const updateEncodedChipValue = ({ chip, color }) => {
      encodedChipDocument = ChipCodec.encode(chip, color)
      encodedChipValue.innerText = `0x${hex32(encodedChipDocument)}`
    }

    encodedChipValue.addEventListener('click', () => {
      const textArea = document.createElement('textarea')
      document.body.appendChild(textArea)
      textArea.innerText = `${encodedChipValue.innerText}`
      textArea.select()
      try {
        const result = document.execCommand('copy')
        console.log(`Copy was ${result}. Copied value ${textArea.innerText} to clipboard`)
      } catch (err) {
        console.error('Unable to copy value to clipboard')
      }
      document.body.removeChild(textArea)
    }, false)

    root.appendChild(encodedChipContainer)

    const grid = document.createElement('div')
    const cells = []

    grid.classList.add('grid')

    for (let i = 0; i < 5; i += 1) {
      for (let j = 0; j < 5; j += 1) {
        const cell = document.createElement('div')
        cell.classList.add('grid-cell')
        cell.dataset.on = false
        cell.dataset.x = j
        cell.dataset.y = i
        cell.dataset.i = j + i * 5
        cells[j + i * 5] = cell
        grid.appendChild(cell)
      }
    }

    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const { x, y, i, on } = cell.dataset

        cell.dataset.on = on === 'false' ? 'true' : 'false'

        if (on === 'true') {
          cell.classList.remove(`swatch--${colors[selectedColor]}`)
          cell.classList.remove('grid-cell--on')
        } else {
          cell.classList.add(`swatch--${colors[selectedColor]}`)
          cell.classList.add('grid-cell--on')
        }

        const chip = {
          chip: cells.map(c => c.classList.contains('grid-cell--on') ? 1 : 0),
          color: selectedColor
        }

        updateEncodedChipValue(chip)
      }, false)
    })

    const palette = document.createElement('div')
    const swatches = []

    palette.classList.add('palette')

    for (let i = 0; i < colors.length; i += 1) {
      const swatch = document.createElement('div')
      swatch.classList.add('swatch')
      swatch.classList.add(`swatch--${colors[i]}`)

      palette.appendChild(swatch)
      swatches.push(swatch)
    }

    swatches.forEach((swatch, index) => {
      swatch.addEventListener('click', () => {
        swatches.filter((s, i) => i !== index).forEach(s => {
          s.classList.remove('swatch--selected')
        })
        swatch.classList.add('swatch--selected')
        selectedColor = index

        const chip = {
          chip: cells.map(c => c.classList.contains('grid-cell--on') ? 1 : 0),
          color: selectedColor
        }

        updateEncodedChipValue(chip)

        cells.filter(c => c.classList.contains('grid-cell--on'))
          .forEach(cell => {
            colors.forEach(color => {
              if (color !== colors[index]) {
                cell.classList.remove(`swatch--${color}`)
              }
            })
            cell.classList.add(`swatch--${colors[index]}`)
          })
      }, false)
    })

    swatches[selectedColor].classList.add('swatch--selected')

    const clearChip = () => {
      cells.forEach(cell => {
        cell.classList.remove('grid-cell--on')
        colors.forEach(color => {
          cell.classList.remove(`swatch--${color}`)
        })
      })
      encodedChipDocument = selectedColor

      const chip = {
        chip: cells.map(c => c.classList.contains('grid-cell--on') ? 1 : 0),
        color: selectedColor
      }
      updateEncodedChipValue(chip)
    }

    const menubar = document.createElement('div')
    menubar.classList.add('menu-bar')
    const menuItems = [
      {
        label: 'New Chip',
        onClick: () => {
          if (encodedChipDocument > 0x0000000F) {
            const choice = window.confirm('Are you sure you want to clear your chip document?')
            if (choice) {
              clearChip()
            }
          } else {
            clearChip()
          }
        }
      },
      {
        label: 'Export',
        onClick: () => {
          const chip = {
            chip: cells.map(c => c.classList.contains('grid-cell--on') ? 1 : 0),
            color: selectedColor
          }

          window.console.log(chip)
        }
      }
    ]
    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('div')
      menuItem.classList.add('menu-item')
      menuItem.innerText = item.label
      menuItem.addEventListener('click', item.onClick, false)
      menubar.appendChild(menuItem)
    })

    const chipset = document.createElement('div')
    const chipviews = []
    chipset.classList.add('chipset__container')

    const chipsetHeader = document.createElement('div')
    chipsetHeader.classList.add('chipset__header')
    chipsetHeader.innerText = 'Chips'

    chipset.appendChild(chipsetHeader)

    for (let i = 0; i < 5; i += 1) {
      const chipview = document.createElement('div')

      chipview.classList.add('chipset__chip-view')
      chipviews.push(chipview)
      chipset.appendChild(chipview)
    }

    chipviews.forEach((chipview, index) => {
      chipview.addEventListener('click', () => {
        selectedChip = index
        chipviews.filter(c => c !== chipview)
          .forEach(c => c.classList.remove('chipset__chip-view--selected'))
        chipview.classList.add('chipset__chip-view--selected')
      }, false)
    })

    chipviews[selectedChip].classList.add('chipset__chip-view--selected')

    root.appendChild(chipset)


    root.appendChild(grid)
    root.appendChild(palette)
    root.appendChild(menubar)

    const state = {
      selectedChip,
      selectedColor,
      encodedChipDocument,
      chipDocumentName
    }

    return { state }
  }

  return load
}())
