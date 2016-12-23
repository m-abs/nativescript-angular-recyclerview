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

  private createRecyclerViewAdapter()/*: android.support.v7.widget.RecyclerView.Adapter */ {
    let that = this;
    let Adapter = android.support.v7.widget.RecyclerView.Adapter.extend({
      onCreateViewHolder(parent/*: android.view.ViewGroup*/, viewType: number) {
        let viewRef: EmbeddedViewRef<any> = that.ngLoader.createEmbeddedView(that.itemTemplate);
        return that.createViewHolder(viewRef, that.recyclerViewList);
      },
      onBindViewHolder(viewHolder/*: android.support.v7.widget.RecyclerView.ViewHolder*/, position: number) {
        that.bindViewHolder(viewHolder, position, that);
      },
      getItemCount() {
        return that.listItems.length;
      }
    });
    return new Adapter();
  }

  private bindViewHolder(viewHolder/*: android.support.v7.widget.RecyclerView.ViewHolder*/, position: number,ownerComponent: RecyclerViewListComponent) {
    // update bindings
    let context = (<any>viewHolder).ngView.context;
    context.$implicit = ownerComponent.listItems[position];
    context.goal = ownerComponent.listItems[position];

    // ng: detect changes
    const childChangeDetector = <ChangeDetectorRef>((<any>viewHolder).ngView);
    childChangeDetector.detectChanges();
  }

  private createViewHolder(ngView: EmbeddedViewRef<any>, owner: RecyclerView) {
    let nsView: View = getNsViewFromNgView(ngView);
    (<any>owner)._addView(nsView);

    let layoutParams = new android.support.v7.widget.RecyclerView.LayoutParams(
      android.view.ViewGroup.LayoutParams.MATCH_PARENT,
      android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
    nsView.android.setLayoutParams(layoutParams);

    let ViewHolder = android.support.v7.widget.RecyclerView.ViewHolder.extend({});
    let viewHolderInstance = new ViewHolder(nsView.android);
    viewHolderInstance.ngView = ngView;
    viewHolderInstance.nsView = nsView;

    return viewHolderInstance;
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
