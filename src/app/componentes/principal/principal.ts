import { Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-principal',
  imports: [Menu, RouterOutlet],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css']
})
export class Principal {}
