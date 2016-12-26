import { CrossView, CrossViewFactory } from "./cross-view.factory";
import { RecyclerView } from "./recycler.view-common";
import { CrossViewHolderType, getRecyclerViewListAdapterClass } from "./recycler-view-list.adapter";
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import application = require("application");
import { View } from "ui/core/view";
import { StackLayout } from "ui/layouts/stack-layout";
import { registerElement } from "nativescript-angular/element-registry";

registerElement("recycler-view", () => require("./recycler.view").RecyclerView);

@Component({
  selector: "recycler-view-list",
  templateUrl: "recycler-view-list.component.html",
  styles: [
    `.recycler-view-container{
        border-width: 2;
        border-color: blue
      }`
  ]
})
export class RecyclerViewListComponent implements AfterViewInit {

  layoutManager: android.support.v7.widget.LinearLayoutManager;

  adapter: android.support.v7.widget.RecyclerView.Adapter;

  @Input() listItems: any[];

  @ContentChild(TemplateRef)
  itemTemplate: TemplateRef<any>;

  @ViewChild("ngLoader", { read: ViewContainerRef })
  private ngLoader: ViewContainerRef;

  @ViewChild("recyclerView")
  private recyclerView: ElementRef;

  constructor(private crossViewFactory: CrossViewFactory) { }

  ngAfterViewInit() {
    // Manually trigger change by setTimeout, see
    // https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html#!#wait-a-tick
    setTimeout(() => {
      let context = application.android.foregroundActivity;
      this.layoutManager = new android.support.v7.widget.LinearLayoutManager(context);
      this.adapter = this.createRecyclerViewAdapter();
    });
  }

  private createRecyclerViewAdapter(): android.support.v7.widget.RecyclerView.Adapter {
    let RecyclerViewListAdapterClass = getRecyclerViewListAdapterClass();

    let itemViewFactoryFunction = () => {
      let ngView = this.ngLoader.createEmbeddedView(this.itemTemplate);
      let crossView = this.crossViewFactory.createFromNgView(ngView);

      // integrate new view in ns tree, so that css, properties,.. are applied and view is attached to android
      (<RecyclerView>this.recyclerView.nativeElement)._addView(crossView.ns);

      return crossView;
    };

    return new RecyclerViewListAdapterClass(itemViewFactoryFunction, this.listItems);
  }
}