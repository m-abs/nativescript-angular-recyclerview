import { EmbeddedViewRef, Injectable } from "@angular/core";
import { View } from "ui/core/view";

@Injectable()
export class CrossViewFactory {

  createFromNgView<T>(ngView: EmbeddedViewRef<T>): CrossView<T> {
    // Filter out text nodes, etc
    // https://docs.nativescript.org/angular/plugins/angular-third-party.html
    const realViews = ngView.rootNodes.filter((node) =>
      node.nodeName && node.nodeName !== "#text");

    if (realViews.length === 0) {
      throw new Error("No suitable views found in list template!");
    } else if (realViews.length > 1) {
      throw new Error("More than one view found in list template!");
    } else {
      return new CrossView(realViews[0], ngView);
      // if (realViews[0]) {
      // } else {
      //     return getSingleViewRecursive(out.ns.children, nestLevel + 1);
    }
  }

}

/**
   * Delivers Angular View and corresponding ns view
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
