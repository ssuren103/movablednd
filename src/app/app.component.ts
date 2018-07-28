import * as _ from 'lodash';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

const LOAD_MORE = 'LOAD_MORE';

export interface DesignType {
  value: string;
  viewValue: string;
}
export interface DoorCollection {
  value: string;
  viewValue: string;
  path: string;
}


export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean, public filename: string, public level: number, public type: any) { }
}

const TREE_DATA = JSON.stringify({
  Applications: {
    Calendar: '../assets/door/lock1.png',
    Chrome: '../assets/door/door2.jpg',
    Webstorm: '../assets/door/door3.jpg'
  }
});

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [FileDatabase]
})
export class AppComponent {
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  trappedBoxes = [];
  availableBoxes = ['box1', 'box2'];
  foods: DesignType[] = [
    { value: 'door', viewValue: 'Door' },
    { value: 'window', viewValue: 'Window' },
  ];

  constructor(database: FileDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }
  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type);
  }

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
  collectionData: any;
  imagepath: any;
  selected: any;
  doorboolean: boolean = false;
  door: DoorCollection[] = [
    { value: 'door1', viewValue: 'Door 1', path: '../assets/door/door1.jpg' },
    { value: 'door2', viewValue: 'Door 2', path: '../assets/door/door2.jpg' },
    { value: 'door3', viewValue: 'Door 3', path: '../assets/door/door3.jpg' },
    { value: 'door4', viewValue: 'Door 4', path: '../assets/door/door4.jpg' },

  ];

  window: DoorCollection[] = [
    { value: 'window1', viewValue: 'Window 1', path: '../assets/door/window1.jpg' },
    { value: 'window2', viewValue: 'Window 2', path: '../assets/door/window1.jpg' },
    { value: 'window3', viewValue: 'Window 3', path: '../assets/door/window1.jpg' },
    { value: 'window4', viewValue: 'Window 4', path: '../assets/door/window1.jpg' },

  ];

  typeChanged(event) {
    if (event.value == 'door') {
      this.collectionData = this.door;
      this.doorboolean = true;
    }
    else {
      this.collectionData = this.window;
      this.doorboolean = false;
    }
  }
  doorType(event) {
    _.map(this.door, value => {
      if (value['value'] == event.value) {
        this.imagepath = value['path'];
      }
    })
  }
  windowType(event) {
    _.map(this.window, value => {
      if (value['value'] == event.value) {
        this.imagepath = value['path'];
      }
    })
  }
  boxSelect(event) {
    var design = {
      'id': this.trappedBoxes.length + 1,
      'name': event
    }
   this.trappedBoxes.push(design);
  }

  boxDeselect(event) {
    _.remove(this.trappedBoxes, value => {
      return value.id == event.id;
    });
  }
}
