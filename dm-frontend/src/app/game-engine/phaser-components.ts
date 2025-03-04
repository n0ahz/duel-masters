const COLOR_PRIMARY = 0xF0F0F0;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const COLOR_TRANSPARENT = 0x000000;
const COLOR_RED = 0xFF0000;
const COLOR_GREEN = 0x00FF00;
const COLOR_BLUE = 0x0000FF;
const COLOR_YELLOW = 0xFFFF00;

export class PhaserComponents {

  static getTextArea(scene, x, y, width, height, header) {
    const rexUI = scene.rexUI;
    return rexUI.add.textArea({
      x: x,
      y: y,
      width: width,
      height: height,
      background: rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
      text: rexUI.add.BBCodeText({
        style: {
          fontSize: '20px',
          fill: '#282dfa',
          padding: { top: 15, left: 15, bottom: 0, right: 15 },
          lineSpacing: 10,
        },
      }),
      slider: {
        track: rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
        thumb: rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
      },
      header: header ? rexUI.add.label({
        height: 30,
        orientation: 0,
        background: rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_LIGHT),
        text: scene.add.text(0, 0, header),
      }) : null,
    }).layout().drawBounds(scene.add.graphics(), COLOR_TRANSPARENT);
  }

  static getDialog(scene, x, y, width, height, header) {
    const rexUI = scene.rexUI;
    return rexUI.add.dialog({
      x: x,
      y: y,
      width: width,
      // height: height,
      background: rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),
      title: rexUI.add.label({
        background: rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
        text: scene.add.text(0, 0, header, {
          fontSize: '24px',
        }),
        space: { left: 15, right: 15, top: 10, bottom: 10 },
      }),
      content: this.getTextArea(scene, 0, 0, 300, 400, ''),
      actions: [
        rexUI.add.label({
          background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),
          text: scene.add.text(0, 0, 'OK', { fontSize: '24px' }),
          space: { left: 10, right: 10, top: 10, bottom: 10 },
        }),
      ],
      space: { title: 25, content: 25, action: 15, left: 20, right: 20, top: 20, bottom: 20 },
      align: { actions: 'left' },
      expand: { content: false },
    }).on('button.over', function (button, groupName, index, pointer, event) {
      button.getElement('background').setStrokeStyle(1, 0xffffff);
    }).on('button.out', function (button, groupName, index, pointer, event) {
      button.getElement('background').setStrokeStyle();
    }).layout();
  }

  static getPopupMenu(scene, x, y, items, clickHandler?) {
    return scene.rexUI.add.menu({
      x: x,
      y: y,
      items: items,
      createButtonCallback: function (item, i) {
        return scene.rexUI.add.label({
          background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_DARK),
          text: scene.add.text(0, 0, item.name, {
            fontSize: '20px',
          }),
          icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
          space: { left: 10, right: 10, top: 10, bottom: 10, icon: 10 },
        });
      },
      easeIn: 500,
      easeOut: 100,
    }).on('button.over', function (button) {
      console.log(button);
      button.getElement('background').setStrokeStyle(1, 0xffffff);
    }).on('button.out', function (button) {
      console.log(button);
      button.getElement('background').setStrokeStyle();
    }).on('button.click', function (button, index, pointer, event) {
      console.log(button, index, pointer, event);
      clickHandler(button, index, pointer, event);
    }).on('popup.complete', function (subMenu) {
      console.log('popup.complete');
    }).on('scaledown.complete', function () {
      console.log('scaledown.complete');
    });
  }

  static getGridTable(scene, x, y, width, height, items) {
    const scrollMode = 0; // 0:vertical, 1:horizontal
    const gridTable = scene.rexUI.add.gridTable({
      x: x,
      y: y,
      width: width,
      height: height,
      scrollMode: scrollMode,
      background: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),
      table: { cellWidth: 96, cellHeight: 40, columns: 3, mask: { padding: 2 }, reuseCellContainer: true },
      header: scene.rexUI.add.label({
        width: (scrollMode === 0) ? undefined : 30,
        height: (scrollMode === 0) ? 30 : undefined,
        orientation: scrollMode,
        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_LIGHT),
        text: scene.add.text(0, 0, ' .: Zones :.'),
      }),
      space: { left: 20, right: 20, top: 20, bottom: 20, table: 10, header: 10, footer: 10 },
      createCellContainerCallback: function (cell, cellContainer) {
        const scene = cell.scene, width = cell.width, height = cell.height, item = cell.item, index = cell.index;
        if (cellContainer === null) {
          cellContainer = scene.rexUI.add.label({
            width: width,
            height: height,
            orientation: scrollMode,
            background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(1, COLOR_DARK),
            icon: scene.add.sprite(0, 0, item.icon),
            text: scene.add.text(0, 0, ''),
            space: { icon: 10, left: (scrollMode === 0) ? 15 : 0, top: (scrollMode === 0) ? 0 : 15 },
          });
        }
        // Set properties from item value
        cellContainer.setMinSize(width, height);
        cellContainer.getElement('text').setText(item.name ? (item.value ? item.value : '0') : '').setColor('black');
        const cellIcon = cellContainer.getElement('icon');
        cellIcon.displayHeight = 30;
        cellIcon.displayWidth = cellIcon.width * (cellIcon.displayHeight / cellIcon.height);
        return cellContainer;
      },
      items: items,
    }).layout();
    gridTable.on('cell.over', function (cellContainer, cellIndex, pointer) {
      cellContainer.getElement('background').setStrokeStyle(2, COLOR_YELLOW).setDepth(1);
    }, this).on('cell.out', function (cellContainer, cellIndex, pointer) {
      cellContainer.getElement('background').setStrokeStyle(2, COLOR_LIGHT).setDepth(0);
    }, this).on('cell.click', function (cellContainer, cellIndex, pointer) {
      // open zone card gallery modal..
      // var nextCellIndex = cellIndex + 1;
      // var nextItem = gridTable.items[nextCellIndex];
      // if (!nextItem) {
      //   return;
      // }
      // nextItem.color = 0xffffff - nextItem.color;
      // gridTable.updateVisibleCell(nextCellIndex);

    }, this);

    return gridTable;
  }

  static getButton(scene, x, y, width, text) {
    const buttons = scene.rexUI.add.buttons({
      x: x, y: y,
      width: width,
      orientation: 'x',

      buttons: [
        scene.rexUI.add.label({
          width: 40,
          height: 40,
          background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_BLUE),
          text: scene.add.text(0, 0, text, {
            fontSize: 18,
          }),
          space: {
            left: 10,
            right: 10,
          },
          align: 'center',
        }),
      ],

      space: {
        left: 10, right: 10, top: 10, bottom: 10,
        item: 3,
      },
      expand: true,
    }).layout();

    buttons.on('button.click', function (button, index, pointer, event) {
      console.log(`Click button-${button.text}`);
    })
    ;
    return buttons;
  }

}

