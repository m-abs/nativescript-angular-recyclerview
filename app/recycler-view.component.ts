import { RecyclerView } from "./recycler-view";
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { StackLayout } from "ui/layouts/stack-layout";
import application = require("application");
import { View } from "ui/core/view";

declare var android: any;

let ViewHolderClass;
const VIEW_HOLDER_VIEW_PROPERTY = "crossView";
function ensureViewHolderClass() {

  if (ViewHolderClass) {
    return;
  }

  ViewHolderClass = android.support.v7.widget.RecyclerView.ViewHolder.extend({});
}

let RecyclerViewAdapterClass;
const RECYCLER_VIEW_ITEM_VIEW_FACTORY_PROPERTY = "itemViewFactory";
const RECYCLER_VIEW_NS_PROPERTY = "recyclerViewNs";
const LIST_ITEMS_PROPERTY = "listItems";
function ensureRecyclerViewAdapterClass() {

  if (RecyclerViewAdapterClass) {
    return;
  }

  RecyclerViewAdapterClass = android.support.v7.widget.RecyclerView.Adapter.extend({
    onCreateViewHolder(parent/*: android.view.ViewGroup*/, viewType: number) {
      let itemView: CrossView<any> = this[RECYCLER_VIEW_ITEM_VIEW_FACTORY_PROPERTY]();
      this[RECYCLER_VIEW_NS_PROPERTY]._addView(itemView.ns);

      let layoutParams = new android.support.v7.widget.RecyclerView.LayoutParams(
        android.view.ViewGroup.LayoutParams.MATCH_PARENT,
        android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
      itemView.android.setLayoutParams(layoutParams);

      ensureViewHolderClass();
      let viewHolderInstance = new ViewHolderClass(itemView.android);
      viewHolderInstance[VIEW_HOLDER_VIEW_PROPERTY] = itemView;

      return viewHolderInstance;
    },
    onBindViewHolder(viewHolder/*: android.support.v7.widget.RecyclerView.ViewHolder*/, position: number) {
      // update bindings
      let context = viewHolder[VIEW_HOLDER_VIEW_PROPERTY].ng.context;
      context.$implicit = this[LIST_ITEMS_PROPERTY][position];
      context.goal = this[LIST_ITEMS_PROPERTY][position];

      // ng: detect changes
      const childChangeDetector = <ChangeDetectorRef>(viewHolder[VIEW_HOLDER_VIEW_PROPERTY].ng);
      childChangeDetector.detectChanges();
    },
    getItemCount() {
      return this[LIST_ITEMS_PROPERTY].length;
    }
  });
}

@Component({
  selector: "recycler-view-list-android",
  template: `
    <StackLayout #nsLayout class="recycler-view-container">
      <DetachedContainer>
        <Placeholder #ngLoader></Placeholder>
      </DetachedContainer>
    </StackLayout>`,
  styles: [
    `.recycler-view-container{
        border-width: 2;
        border-color: blue
      }`
  ]
})
export class RecyclerViewListComponent implements AfterContentInit {

  @Input() listItems: any[];

  @ContentChild(TemplateRef)
  itemTemplate: TemplateRef<any>;

  @ViewChild("nsLayout")
  nsLayout: ElementRef;

  @ViewChild("ngLoader", { read: ViewContainerRef })
  private ngLoader: ViewContainerRef;

  private recyclerViewList: RecyclerView;

  constructor(private element: ElementRef) { }

  ngAfterContentInit() {
    let context = application.android.context;
    this.recyclerViewList = new RecyclerView();
    this.recyclerViewList.adapter = this.createRecyclerViewAdapter();
    this.recyclerViewList.layoutManager = new android.support.v7.widget.LinearLayoutManager(context);

    (<StackLayout>this.nsLayout.nativeElement).addChild(this.recyclerViewList);
  }

  private createRecyclerViewAdapter()/*: android.support.v7.widget.RecyclerView.Adapter */ {
    ensureRecyclerViewAdapterClass();

    let recyclerViewInstance = new RecyclerViewAdapterClass();
    recyclerViewInstance[RECYCLER_VIEW_ITEM_VIEW_FACTORY_PROPERTY] = () => {
      let ngView = this.ngLoader.createEmbeddedView(this.itemTemplate);
      let nsView = getNsViewFromNgView(ngView);
      return new CrossView(nsView, ngView);
    };
    recyclerViewInstance[RECYCLER_VIEW_NS_PROPERTY] = this.recyclerViewList;
    recyclerViewInstance[LIST_ITEMS_PROPERTY] = this.listItems;
    return recyclerViewInstance;
  }
}

/**
   * Delivers Angular View and corresponding ns view as tuple
   *
   * @returns {[EmbeddedViewRef<any>, View]}
   *
   * @memberOf RecyclerViewListItemHandler
   */
export class CrossView<T> {

  constructor(public ns: View, public ng : EmbeddedViewRef<T>){}

  get android(): any /*android.view.View*/ {
    return this.ns.android;
  }

  get ios(): any /* ios view  */ {
    return this.ns.ios;
  }
}



function getNsViewFromNgView<T>(ngView: EmbeddedViewRef<T>): View {
  const realViews = ngView.rootNodes.filter((node) =>
    node.nodeName && node.nodeName !== "#text");

  if (realViews.length === 0) {
    throw new Error("No suitable views found in list template!");
  } else if (realViews.length > 1) {
    throw new Error("More than one view found in list template!");
  } else {
    return realViews[0];
  }
}