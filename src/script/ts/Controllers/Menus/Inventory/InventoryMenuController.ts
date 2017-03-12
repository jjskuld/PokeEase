class InventoryMenuController implements IInventoryMenuController {
    private config: IInventoryMenuControllerConfig;

    constructor(config: IInventoryMenuControllerConfig) {
        this.config = config;
    }

    public inventoryListRequested = (request: IRequest): void => {
        this.config.inventoryLoadingSpinner.show();
    }

    public updateInventoryList = (inventoryList: IInventoryListEvent): void => {
        const currentItems = this.config.inventoryMenuElement.find(`.product`);
        currentItems.removeClass("brighter");
        currentItems.find(".number").text(0);
        currentItems.find(".slider input:first").ionRangeSlider(  {
                min:0,
                max:0,
                from:0});

        for (let i = 0; i < inventoryList.Items.length; i++) {
            const item = inventoryList.Items[i];
            const itemElement = this.config.inventoryMenuElement.find(`.product[data-item-id="${item.ItemId}"]`);
            itemElement.addClass("brighter");
            itemElement.data("total", item.Count);
            itemElement.find(".number").text(item.Count);
            //itemElement.find(".slider input:first").ionRangeSlider( {
            //    min:0,
            //    max:item.Count,
            //    from:item.Count,
            //    onChange: (data)=> {
            //        let numberOfDelete = item.Count - data.from;
            //        itemElement.find(".delete").text(numberOfDelete);
            //        itemElement.find(".recycle").css('opacity', numberOfDelete > 0? 1: 0.3)
            //                    .data('items', numberOfDelete)
            //                    .data('itemId',  itemElement.attr('data-item-id'));
            //    }
            //});
            
            var slider = itemElement.find(".slider input:first").data("ionRangeSlider");
            if(slider){
                slider.update( {
                    min:0,
                    max:item.Count,
                    from:item.Count,
                    onChange: (data)=> {
                    let numberOfDelete = item.Count - data.from;
                    itemElement.find(".delete").text(numberOfDelete);
                    itemElement.find(".recycle").css('opacity', numberOfDelete > 0? 1: 0.3)
                                .data('items', numberOfDelete)
                                .data('itemId',  itemElement.attr('data-item-id'));
                    }
                });
            }
            itemElement.find(".recycle").unbind('click').click(this.recycleItems);
        }
        this.config.inventoryLoadingSpinner.fadeOut(150);
    }
    public recycleItems = (ev:JQueryEventObject) :void => {
        const deleteItems = $(ev.target).data().items;
        const itemId =   $(ev.target).data().itemId;
        const itemElement = $(ev.target).closest('.product')
        const total = itemElement.data().total;

        if(deleteItems> 0) {
            this.config.requestSender.sendRecycleRequest(itemId, deleteItems);
            //reset number show on list
            $(ev.target).data('items',0);
            itemElement.find(".delete").text(0);
            itemElement.find(".number").text(total - deleteItems);
            itemElement.data('total', total - deleteItems);
            itemElement.find(".recycle").css('opacity',0.3)
            var slider = itemElement.find(".slider input:first").data("ionRangeSlider");
            if(slider){
                slider.update( {
                    min:0,
                    max:total - deleteItems,
                    from:total - deleteItems,
                });
            }

        }
    }
}