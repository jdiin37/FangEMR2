/*
jQWidgets v5.2.0 (2017-Sep)
Copyright (c) 2011-2017 jQWidgets.
License: http://jqwidgets.com/license/
*/
!function(t){t.extend(t.jqx._jqxChart.prototype,{_moduleApi:!0,getItemsCount:function(t,e){var i=this.seriesGroups[t];if(!this._isSerieVisible(t,e))return 0;var r=this._renderData;return!i||!r||r.length<=t?0:i.series[e]?r[t].offsets[e].length:0},getXAxisRect:function(t){var e=this._renderData;if(e&&!(e.length<=t)&&e[t].xAxis)return e[t].xAxis.rect},getXAxisLabels:function(t){var e=[],i=this._renderData;if(!i||i.length<=t)return e;if(!(i=i[t].xAxis))return e;var r=this.seriesGroups[t];if(r.polar||r.spider){for(l=0;l<i.polarLabels.length;l++){var s=i.polarLabels[l];e.push({offset:{x:s.x,y:s.y},value:s.value})}return e}for(var a=this._getXAxis(t),o=this.getXAxisRect(t),n="top"==a.position||"right"==a.position,u="horizontal"==r.orientation,l=0;l<i.data.length;l++)u?e.push({offset:{x:o.x+(n?0:o.width),y:o.y+i.data.data[l]},value:i.data.xvalues[l]}):e.push({offset:{x:o.x+i.data.data[l],y:o.y+(n?o.height:0)},value:i.data.xvalues[l]});return e},getValueAxisRect:function(t){var e=this._renderData;if(e&&!(e.length<=t)&&e[t].valueAxis)return e[t].valueAxis.rect},getValueAxisLabels:function(t){var e=[],i=this._renderData;if(!i||i.length<=t)return e;if(!(i=i[t].valueAxis))return e;var r=this._getValueAxis(t),s="top"==r.position||"right"==r.position,a=this.seriesGroups[t],o="horizontal"==a.orientation;if(a.polar||a.spider){for(u=0;u<i.polarLabels.length;u++){var n=i.polarLabels[u];e.push({offset:{x:n.x,y:n.y},value:n.value})}return e}for(var u=0;u<i.items.length;u++)o?e.push({offset:{x:i.itemOffsets[i.items[u]].x+i.itemWidth/2,y:i.rect.y+(s?i.rect.height:0)},value:i.items[u]}):e.push({offset:{x:i.rect.x+i.rect.width,y:i.itemOffsets[i.items[u]].y+i.itemWidth/2},value:i.items[u]});return e},getPlotAreaRect:function(){return this._plotRect},getRect:function(){return this._rect},showToolTip:function(t,e,i,r,s){var a=this.getItemCoord(t,e,i);isNaN(a.x)||isNaN(a.y)||this._startTooltipTimer(t,e,i,a.x,a.y,r,s)},hideToolTip:function(t){isNaN(t)&&(t=0);var e=this;e._cancelTooltipTimer(),setTimeout(function(){e._hideToolTip(0)},t)}})}(jqxBaseFramework);

