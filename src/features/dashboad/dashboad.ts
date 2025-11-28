import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Nav } from "../../Layout/nav/nav";
import { Search } from "../search/search";
import { Details } from "../details/details";

@Component({
  selector: 'app-dashboad',
  imports: [RouterOutlet, Nav, Search],
  templateUrl: './dashboad.html',
  styleUrl: './dashboad.css',
})
export class Dashboad {


  
}
