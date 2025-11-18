import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './data-grid.html',
  styleUrls: ['./data-grid.scss']
})
export class DataGrid {

  @Input() columnDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = { resizable: true, sortable: true, filter: true };
  @Input() rowData: any[] = [];
  @Input() height = 500;
  @Input() pagination = true;
  @Input() pageSize = 25;
  @Input() context: any;

  @Output() gridReady = new EventEmitter<GridApi>();

  private api!: GridApi;

  onGridReady(event: GridReadyEvent) {
    this.api = event.api;
    this.gridReady.emit(this.api);
  }
}
