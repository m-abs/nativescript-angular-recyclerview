import { CrossViewFactory } from "./cross-view.factory";
import { HomeComponent } from "./home.component";
import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ItemsComponent } from "./items.component";
import { RecyclerViewListComponent } from "./recycler-view-list.component";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Routes } from "@angular/router";

import { AppComponent } from "./app.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "items", component: ItemsComponent },
    { path: "home", component: HomeComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        RecyclerViewListComponent,
        ItemsComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
    exports: [
        NativeScriptRouterModule
    ],
    providers: [
        CrossViewFactory
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
