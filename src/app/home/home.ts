import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Api } from '../../shared/services/api';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  refData: any[] = [];
  displayedColumns: string[] = [
    'no',
    'nama',
    'cabang',
    'tahun',
    'penyelenggara',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  searchKeyword: string = '';
  showAddModal = false;
  showEditModal = false;
  selected: any = null;
  isLoading = false;
  isInitialEmpty = false;
  isSearching = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getData() {
    this.isLoading = true;
    this.isSearching = false;

    this.apiService.getPrestasi({}).subscribe({
      next: (data: any) => {
        this.refData = data?.val || [];
        this.dataSource.data = this.refData;
        this.isInitialEmpty = this.refData.length === 0;
        this.isLoading = false;
      },
      error: () => {
        this.dataSource.data = [];
        this.isInitialEmpty = true;
        this.isLoading = false;
      },
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.selected = null;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.selected = null;
  }

  addData(
    nama_prestasi: string,
    cabang_prestasi: string,
    tahun_prestasi: string,
    penyelenggara_prestasi: string
  ) {
    if (
      !nama_prestasi ||
      !cabang_prestasi ||
      !tahun_prestasi ||
      !penyelenggara_prestasi
    ) {
      Swal.fire('Gagal', 'Lengkapi semua field', 'error');
      return;
    }

    const payload = {
      nama_prestasi,
      cabang_prestasi,
      tahun_prestasi,
      penyelenggara_prestasi,
    };

    this.apiService.addPrestasi(payload).subscribe({
      next: () => {
        Swal.fire(
          'Berhasil',
          `Prestasi "${nama_prestasi}" berhasil ditambahkan.`,
          'success'
        );
        this.getData();
        this.closeAddModal();
      },
      error: () => Swal.fire('Gagal', 'Prestasi gagal ditambahkan.', 'error'),
    });
  }

  openEditModal(row: any) {
    this.selected = { ...row };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selected = null;
  }

  editData() {
    if (!this.selected) return;

    const {
      id_prestasi,
      nama_prestasi,
      cabang_prestasi,
      tahun_prestasi,
      penyelenggara_prestasi,
    } = this.selected;

    if (
      !nama_prestasi ||
      !cabang_prestasi ||
      !tahun_prestasi ||
      !penyelenggara_prestasi
    ) {
      Swal.fire('Gagal', 'Lengkapi semua field', 'error');
      return;
    }

    const payload = {
      id_prestasi,
      nama_prestasi,
      cabang_prestasi,
      tahun_prestasi,
      penyelenggara_prestasi,
    };

    this.apiService.editPrestasi(payload).subscribe({
      next: () => {
        Swal.fire(
          'Berhasil',
          `Prestasi "${nama_prestasi}" berhasil diperbarui.`,
          'success'
        );
        this.getData();
        this.closeEditModal();
      },
      error: () => Swal.fire('Gagal', 'Prestasi gagal diperbarui.', 'error'),
    });
  }
  openDeleteModal(row: any): void {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus Prestasi "${row.nama_prestasi}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteData(row.id_prestasi, row.nama_prestasi);
      }
    });
  }
  deleteData(id_prestasi: any, nama_prestasi: string) {
    const payload = { id_prestasi };
    this.apiService.deletePrestasi(payload).subscribe({
      next: () => {
        Swal.fire(
          'Terhapus',
          `Prestasi "${nama_prestasi}" telah dihapus.`,
          'success'
        );
        this.getData();
      },
      error: () => Swal.fire('Gagal', 'Prestasi gagal dihapus.', 'error'),
    });
  }

  searchData() {
    const keyword = this.searchKeyword.trim();
    if (!keyword) {
      this.getData();
      return;
    }

    this.isSearching = true;

    this.apiService.searchPrestasi({ nama_prestasi: keyword }).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.val;
        this.isSearching = false;
      },
      error: () => {
        console.error('Gagal mengambil data dari server');
        this.isSearching = false;
      },
    });
  }

  clearSearch() {
    this.searchKeyword = '';
    this.isSearching = false;
    this.getData();
  }
}
