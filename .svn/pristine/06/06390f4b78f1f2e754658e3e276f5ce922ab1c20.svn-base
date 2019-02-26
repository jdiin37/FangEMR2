var cellsrenderer = function(row, columnfield, value, defaulthtml,
		columnproperties) {
	if (value == '男') {
		return '<span style="margin: 4px; float: '
				+ columnproperties.cellsalign + '; color: #0000ff;">' + value
				+ '</span>';
	} else {
		return '<span style="margin: 4px; float: '
				+ columnproperties.cellsalign + '; color: #008000;">' + value
				+ '</span>';
	}
}

var cellclass_noEdit = function(row, columnfield, value) {
	// if (value < 3) {
	// return 'red';
	// } else if (value >= 3 && value < 8) {
	// return 'yellow';
	// } else return 'green';
	return 'bg-defult';
};

var columnrenderer_NotNull = function(value) {
	return '<div class="text-center text-primary" style="margin-top: 5px;">'
			+ value + '</div>';
}

var columnrenderer_Pkey = function(value) {
	return '<div class="text-center text-danger" style="margin-top: 5px;">*'
			+ value + '</div>';
}



function getDataColumns(paraMethod) {
	var columns;
	if (paraMethod == "getZonSet") {
		columns = [ {
			text : 'zone',
			datafield : 'zone',
			width : 100
		}, {
			text : 'zone_name',
			datafield : 'zone_name',
			width : 100
		}, {
			text : 'clinic_flag',
			datafield : 'clinic_flag',
			width : 180
		}, {
			text : 'hospsid',
			datafield : 'hospsid',
			width : 180
		}, {
			text : 'ip_address',
			datafield : 'ip_address',
			width : 180
		} ];
	}

	if (paraMethod == "getPatinpListInp") {
		columns = [
				{
					text : '序',
					sortable : false,
					filterable : false,
					editable : false,
					groupable : false,
					draggable : false,
					resizable : false,
					datafield : '',
					columntype : 'number',
					width : 50,
					cellsrenderer : function(row, column, value) {
						return "<div style='margin:4px;'>" + (value + 1)
								+ "</div>";
					}
				},
				{
					text : '病歷號',
					datafield : 'chart_no',
					columntype : 'textbox',
					filtertype : 'textbox',
					width : 60,
					renderer : columnrenderer_Pkey,
					editable : false,
					cellclassname : cellclass_noEdit
				},
				{
					text : 'serno',
					datafield : 'serno',
					width : 60
				},
				{
					text : '姓名',
					datafield : 'pt_name',
					width : 100,
					renderer : columnrenderer_NotNull,
				},
				{
					text : 'pt_type',
					datafield : 'pt_type',
					width : 50
				},
				{
					text : '身分別',
					datafield : 'type_name',
					width : 150,
					columntype : 'dropdownlist',
					createeditor : function(row, column, editor) {
						// assign a new data source to the dropdownlist.
						var list = [ '健保', '自費', '一般' ];
						editor.jqxDropDownList({
							autoDropDownHeight : true,
							source : list,
							promptText : "請選擇身分別:"
						});
					},
					// update the editor's value before saving it.
					cellvaluechanging : function(row, column, columntype,
							oldvalue, newvalue) {
						// return the old value, if the new value is empty.
						if (newvalue == "")
							return oldvalue;
					}
				},
				{
					text : 'price_type',
					datafield : 'price_type',
					width : 50
				},
				{
					text : '性別代號',
					datafield : 'sex',
					width : 50
				},
				{
					text : '性別',
					datafield : 'sex_name',
					width : 50,
					cellsrenderer : cellsrenderer
				},
				{
					text : '床號',
					datafield : 'bed_no',
					width : 50
				},
				{
					text : 'ns',
					datafield : 'ns',
					width : 50
				},
				{
					text : '院區',
					datafield : 'dept_name',
					width : 100,
					columntype : 'combobox',
					createeditor : function(row, column, editor) {
						// assign a new data source to the combobox.
						var list = [ '馨蕙馨病房', '馨蕙馨病房B', '馨蕙馨病房C' ];
						editor.jqxComboBox({
							autoDropDownHeight : true,
							source : list,
							promptText : "請選擇科別:"
						});
					},
					// update the editor's value before saving it.
					cellvaluechanging : function(row, column, columntype,
							oldvalue, newvalue) {
						// return the old value, if the new value is empty.
						if (newvalue == "")
							return oldvalue;
					}
				}, {
					text : '入院日期',
					datafield : 'ckin_date',
					width : 100,
					cellsalign : 'right',
					cellsformat : 'd',
					columntype: 'datetimeinput',
					validation : function(cell, value) {
						if (value == "")
							return true;
						var year = value.getFullYear();
						if (year >= 2017) {
							return {
								result : false,
								message : "日期不得大於  2017/01/01"
							};
						}
						return true;
					}
				}, {
					text : '入院時間',
					datafield : 'ckin_time',
					width : 60
				}, {
					text : 'op_date',
					datafield : 'op_date',
					width : 60
				}, {
					text : 'op_days',
					datafield : 'op_days',
					width : 60
				}, {
					text : 'vs',
					datafield : 'vs',
					width : 50
				}, {
					text : 'division',
					datafield : 'division',
					width : 50
				}, {
					text : '科別',
					datafield : 'div_name',
					width : 100
				}, {
					text : 'discharge_reason',
					datafield : 'discharge_reason',
				}, {
					text : 'discharge_date',
					datafield : 'discharge_date',
				}, {
					text : 'discharge_time',
					datafield : 'discharge_time',
				}, {
					text : 'emg_days',
					datafield : 'emg_days',
				}, {
					text : 'chronic_day',
					datafield : 'chronic_day',
				}, {
					text : 'part_no',
					datafield : 'part_no',
				}, {
					text : 'card_seq',
					datafield : 'card_seq',
				}, {
					text : 'brain_flag',
					datafield : 'brain_flag',
				}, {
					text : 'status',
					datafield : 'status',
				}, {
					text : 'close_acnt_date',
					datafield : 'close_acnt_date',
				}, {
					text : 'zone',
					datafield : 'zone',
				}, {
					text : 'zone_name',
					datafield : 'zone_name',
				}, {
					text : 'spec_list',
					datafield : 'spec_list',
				}, {
					text : 'appoint_discharge_date',
					datafield : 'appoint_discharge_date',
				}, {
					text : 'status_result',
					datafield : 'status_result',
				}, {
					text : 'acnt_date',
					datafield : 'acnt_date',
				}, {
					text : 'inpspec_name',
					datafield : 'inpspec_name',
				}, {
					text : 'discharge_name',
					datafield : 'discharge_name',
				} ];
	}
	return columns;
}