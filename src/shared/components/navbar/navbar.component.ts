import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

/**
 * Componente de barra de navegación superior con sidenav
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <mat-sidenav-container class="sidenav-container" [hasBackdrop]="isMobile">
      <!-- Sidenav -->
      <mat-sidenav
        #sidenav
        [mode]="isMobile ? 'over' : 'side'"
        [opened]="!isMobile"
        class="sidenav">
        <div class="sidenav-header">
          <mat-icon class="brand-icon">pets</mat-icon>
          <span class="brand-text">PetManager</span>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item
             routerLink="/clientes"
             routerLinkActive="active-link"
             [routerLinkActiveOptions]="{exact: true}"
             (click)="isMobile && sidenav.close()">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Inicio</span>
          </a>
          <a mat-list-item
             routerLink="/clientes"
             routerLinkActive="active-link"
             (click)="isMobile && sidenav.close()">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Clientes</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Contenido principal -->
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="navbar">
          <mat-toolbar-row>
            <button
              mat-icon-button
              class="menu-button"
              (click)="sidenav.toggle()"
              [class.hide-desktop]="!isMobile">
              <mat-icon>menu</mat-icon>
            </button>

            <span class="spacer"></span>

            <div class="navbar-actions">
              <button mat-icon-button>
                <mat-icon>notifications</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>account_circle</mat-icon>
              </button>
            </div>
          </mat-toolbar-row>
        </mat-toolbar>

        <!-- Contenido de la app -->
        <div class="main-content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
      width: 100%;
    }

    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #023047 0%, #219ebc 100%);

      .sidenav-header {
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: white;

        .brand-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }

        .brand-text {
          font-size: 18px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }
      }

      mat-divider {
        background-color: rgba(255, 255, 255, 0.2);
        margin: 0 16px 16px 16px;
      }

      mat-nav-list {
        padding: 0 8px;

        a {
          color: rgba(255, 255, 255, 0.9);
          font-family: 'Poppins', sans-serif;
          margin: 4px 0;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          &.active-link {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-weight: 600;
          }

          mat-icon {
            color: rgba(255, 255, 255, 0.9);
          }

          &:hover mat-icon,
          &.active-link mat-icon {
            color: white;
          }
        }
      }
    }

    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      background: linear-gradient(135deg, #219ebc 0%, #8ecae6 100%) !important;
    }

    mat-toolbar-row {
      height: 56px;
      padding: 0 16px;
    }

    .menu-button {
      margin-right: 16px;

      &.hide-desktop {
        display: none;
      }
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;

      .brand-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .brand-text {
        font-size: 17px;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .navbar-actions {
      display: flex;
      gap: 8px;
    }

    .main-content {
      width: 100%;
      background: #f8f9fa;
      padding: 24px;
      min-height: calc(100vh - 64px);
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 280px;
      }

      .menu-button.hide-desktop {
        display: block !important;
      }

      .navbar-brand {
        .brand-text {
          font-size: 18px;
        }
      }

      .main-content {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: 12px;
      }

      .navbar-brand .brand-text {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }
}

