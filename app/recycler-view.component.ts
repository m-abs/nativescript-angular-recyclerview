import { RecyclerView } from "./recycler-view";
import { getRecyclerViewAdapterClass } from "./recycler-view.adapter";
import {
    AfterContentInit,
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

  ngAfterContentInit() {
    let context = application.android.context;
    this.recyclerViewList = new RecyclerView();
    this.recyclerViewList.adapter = this.createRecyclerViewAdapter();
    this.recyclerViewList.layoutManager = new android.support.v7.widget.LinearLayoutManager(context);

    (<StackLayout>this.nsLayout.nativeElement).addChild(this.recyclerViewList);
  }

  private createRecyclerViewAdapter(): android.support.v7.widget.RecyclerView.Adapter  {
    let RecyclerViewAdapter  = getRecyclerViewAdapterClass();
    
    let itemViewFactoryFunction = () => {
      let ngView = this.ngLoader.createEmbeddedView(this.itemTemplate);
      let nsView = getNsViewFromNgView(ngView);
      return new CrossView(nsView, ngView);
    };

    return new RecyclerViewAdapter(itemViewFactoryFunction, this.recyclerViewList, this.listItems);
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

  get android(): android.view.View {
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