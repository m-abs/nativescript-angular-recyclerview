import { CrossViewFactory } from "./cross-view.factory";
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

  constructor(private crossViewFactory : CrossViewFactory){}

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
      return this.crossViewFactory.createFromNgView(ngView);
    };

    return new RecyclerViewAdapter(itemViewFactoryFunction, this.recyclerViewList, this.listItems);
  }
}