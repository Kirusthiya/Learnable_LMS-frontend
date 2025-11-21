import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Nav } from "../../Layout/nav/nav";

@Component({
  selector: 'app-dashboad',
  imports: [RouterOutlet, Nav],
  templateUrl: './dashboad.html',
  styleUrl: './dashboad.css',
})
export class Dashboad {

}
