- FINISH DRAW
  - Fix layout of ColorSelectionSheet
    - Draw a path with the svg below
    - Add a scrollview below it and then add
      - Add a color picker / gradient picker that changes the color of the path
      - Add stroke width that changes the path width
      - Add stroke styles that changes the path style
  - Implement a drawing mode that is activated when browsing ColorSelectionSheet
    - There should be a tick and an x button on the top center of the screen
    - The tick button should save the path
    - The x button should clear the path

<svg width="300" height="120" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 40 C 80 90, 120 90, 150 40 S 220 -10, 290 40" fill="none" stroke="black" stroke-width="4" />
</svg>
