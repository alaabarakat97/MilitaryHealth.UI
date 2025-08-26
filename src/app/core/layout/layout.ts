import { Component,  } from '@angular/core';
import {   RouterOutlet } from '@angular/router';
import { Topbar } from "./topbar/topbar";
import { Sidebar } from "./sidebar/sidebar";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Topbar, Sidebar, Footer ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
isSidebarCollapsed = false;
}
