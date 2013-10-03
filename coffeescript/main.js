function showFOrders()
{

	if (0>=fOrders.length) return;

	var order=fOrders.pop();
  var str = '<tr class="data" style="display: none" id="fOrder' + order.id + '">';
  str += '<td class="num">' + order.mob + '</td>';
  str += '<td>' + order.type + '</td>';
  str += '<td>¥' + order.amt + '</td>';
  str += '</tr>';

	$('#fListTop').after(str);
	$('#fOrder'+order.id).slideDown('slow');

	foCount++;
	if (10==foCount)
	{
		clearInterval(fwid);
		fwid=setInterval('showFOrders();', 10000);
	}
}

function showOrders()
{
	if (0>=orders.length) return;

	var order=orders.pop();
  var str1 = '<tr class="data" style="display: none" id="fOrder' + order.id + '">';
  str += '<td class="num">' + order.mob + '</td>';
  str += '<td>' + order.type + '</td>';
  str += '<td>¥' + order.amt + '</td>';
  str += '</tr>';

	$('#listTop').after(str1);
	$('#order'+order.id).slideDown('slow');

	oCount++;
	if (10==oCount)
	{
		clearInterval(wid);
		wid=setInterval('showOrders();', 5000);
	}
}

function showPrice(json)
{
	if (0>=json.flag)
	{
		alert(json.msg);
		return ;
	}

	$("#lastPrice").val();
	$("#lastPrice").val(json.price);
	count=dTime;

	if (json.orders.length>0)
	{
		oId=json.orders[0].id;
		for(var i=0;i<json.orders.length;i++)
		{
			orders.push(json.orders[i]);
		}
	}

	if (json.fOrders.length>0)
	{
		foId=json.fOrders[0].id;
		for(var i=0;i<json.fOrders.length;i++)
		{
			fOrders.push(json.fOrders[i]);
		}
	}

	return ;
}

function timer()
{
	count--;
	if (count>0)
	{
		$("#loading").html(count);
		return;
	}

	count=dTime;
	$("#loading").html(count);
	$.getJSON(
	   'ajax.php?act=price&oId='+oId+'&foId='+foId,
	   function(json){
		 showPrice(json);
	   }
	 );
}

function validate_phone($node){
	var mob=$node.val();
	var re=/^\d{11}$/;
	if (!re.test(mob))
	{
    $node.parent('td').removeClass('has-success');
    $node.parent('td').addClass('has-error');
		return false;
	}else{
    $node.parent('td').removeClass('has-error');
    $node.parent('td').addClass('has-success');
    $node.tooltip('destroy')
    return true;
  }
}

function validate_code($node){
  var code = $node.val()

	var re=/^\d{4}$/g;
	if (!re.test(code))
	{
    $node.parent('td').removeClass('has-success');
    $node.parent('td').addClass('has-error');
		return false;
	}else{
    $node.parent('td').removeClass('has-error');
    $node.parent('td').addClass('has-success');
    $node.tooltip('destroy')
    return true;
  }
}


function submitOrder()
{

  if(!validate_phone($('#phone'))){
		/* alert("[手机号]必须输入且应为11位数字"); */
    $("#phone").data('title', '手机号]必须输入且应为11位数字')
    $("#phone").data('placement', 'right')
    $('#phone').tooltip('show')
  }else if(!validate_code($("#code"))){
    $("#code").data('title', '验证码必须输入且为4位')
    $("#code").data('placement', 'right')
    $('#code').tooltip('show')
  }else{
    var amt = $("#money").val();
    var mob = $('#phone').val();
    $.getJSON(
       'ajax.php?act=step1&mob='+mob+'&amt='+amt,
       function(json){
         showOrderConfirm(json);
       }
     );

    $("#charge").modal('show')
  }
}

function searchOrder()
{
  if(!validate_phone($("#sPhone"))){
		/* alert("[手机号]必须输入且应为11位数字"); */
    $("#sPhone").data('title', '手机号]必须输入且应为11位数字')
    $("#sPhone").data('placement', 'right')
    $('#sPhone').tooltip('show')
  }else if(!validate_code($("#sCode"))){
    $("#sCode").data('title', '验证码必须输入且为4位')
    $("#sCode").data('placement', 'right')
    $('#sCode').tooltip('show')
  }else{
    var mob = $("#sPhone").val();
    $.getJSON(
       'ajax.php?act=presearch&mob='+mob,
       function(json){
       showSearchConfirm(json);
       }
     );

    $('#check').modal('show')
  }
}

function showOrderConfirm(json)
{
	if (0>=json.flag)
	{
		alert(json.msg);
		return ;
	}

	diag.Width = 350;
	diag.Height = 250;
	diag.Title = "请确认";
	diag.InnerHtml=json.html;
	diag.OKEvent = function(){orderConfirm(diag);};
	diag.show();
	diag.cancelButton.value="返回修改";
	diag.okButton.value="确定无误";
	return ;
}

function orderConfirm(diag)
{
	var mob=$("#phone").val();
	var amt=$("#money").val();
	var code=$("#confirmCode").val();
	var re=/^\d{4}$/g;
	if (!re.test(code))
	{
		$("#confirmCode").focus();
		alert("[验证码]必须输入且应为4位数字");
		return ;
	}

	$.getJSON(
	   'ajax.php?act=step2&mob='+mob+'&amt='+amt+'&code='+code,
	   function(json){
		 showOrderPay(json,diag);
	   }
	 );
}

function showOrderPay(json,diag)
{
	if (0>=json.flag)
	{
		alert(json.msg);
		return ;
	}

	showOrder(json);
	alert('订单已成功创建,请按照提示支付BTC!');
	diag.close();
}


function showSearchConfirm(json)
{
	if (0>=json.flag)
	{
		alert(json.msg);
		return ;
	}

	diag.Width = 350;
	diag.Height = 160;
	diag.Title = "请确认";
	diag.InnerHtml=json.html;
	diag.OKEvent = function(){searchConfirm(diag);};
	diag.show();
	diag.cancelButton.value="返回修改";
	diag.okButton.value="确定无误";
	return ;
}

function searchConfirm(diag)
{
	var mob=$("#sPhone").val();
	var code=$("#confirmCode").val();
	var re=/^\d{4}$/g;
	if (!re.test(code))
	{
		$("#confirmCode").focus();
		alert("[验证码]必须输入且应为4位数字");
		return ;
	}

	$.getJSON(
	   'ajax.php?act=search&mob='+mob+'&code='+code,
	   function(json){
		 showSearchList(json,diag);
	   }
	 );
}

function showSearchList(json,diag)
{
	if (0>=json.flag)
	{
		alert(json.msg);
		return ;
	}
	diag.close();

	diag.Width = 400;
	diag.Height = 500;
	diag.Title = "订单查询--------(只能查询最近10天内的订单)";
	diag.InnerHtml=json.html;
	diag.OKEvent=function(){
		$("#sPhone").val('');
		$("#sPhone").focus();
		diag.close();
	};
	diag.show();
	diag.cancelButton.value="关闭";
	diag.okButton.value="返回重查";
	return ;
}

function viewOrder(id)
{
  // 这里和后台交互  我先注释掉
	// $.getJSON(
	//    'ajax.php?act=order&id='+id,
	//    function(json) {
	// 	 showOrder(json);
	//    }
	//  );
  //
  //我自己伪造的data
  var data = {expire: true}
  if(id === 2 || id === 3){
    data = {expire: false}
  }
  if(data.expire){
    $("#charge").css('z-index', $('#check').css('z-index') + 1);
    $("#charge").modal('show');
  }else{
    $("#check2").css('z-index', $('#check').css('z-index') + 1);
    $("#check2").modal('show');
  }
}

var clip1=clip2=0;
function showOrder(json)
{
	if (0>=json.flag)
	{
		alert(json.msg);
		return ;
	}

	diag.Width = 400;
	diag.Height = 500;
	diag.Title = "查看订单";
	diag.InnerHtml=json.html;
	diag.OKEvent=function(){
		destroyClipBoard();
		diag.close();
		viewOrder(json.orderId);
	};
	diag.CancelEvent=function(){
		destroyClipBoard();
		diag.close();
	};
	diag.show();
	diag.cancelButton.value="关闭";
	diag.okButton.value="刷新";
	setClipBoard();
	return ;
}

function destroyClipBoard()
{
	if (0==clip1) return;

	clip1.destroy();
	clip2.destroy();
	clip1=clip2=0;
}

function setClipBoard()
{
	if (0==clip1)
	{
		clip1=clipboard('payBtc','比特币地址已拷贝到剪切板');
		clip2=clipboard('payBtcamt','比特币金额已拷贝到剪切板');
	} else {
		clip1.show();
		clip2.show();
	}
}

function clipboard(objId,msg)
{
	var clip=new ZeroClipboard.Client();
	clip.setHandCursor(true);
	clip.glue(objId);
	clip.setText($('#'+objId).val());
	clip.addEventListener( "complete", function(){ alert(msg); });
	return clip;
}

function changeMoney(obj)
{
	var fee=$(obj.options[obj.selectedIndex]).attr("fees");
	$("#orderFees").html(fee);
}

function changeYzm(obj) {
	var thisSrc=obj.src;
	thisSrc=thisSrc.split("&")[0]+"&"+Math.random();
	obj.src=thisSrc;
}


$(function(){
  $("#phone").on('keyup', function(){
    validate_phone($('#phone'));
  });
  $("#sPhone").on('keyup', function(){
    validate_phone($('#sPhone'));
  });
  $("#code").on('keyup', function(){
    validate_code($('#code'));
  });
  $("#sCode").on('keyup', function(){
    validate_code($('#sCode'));
  });

  $("#money").on("change", function(){
    var temp_btc_value = 120 * 6.10;
    var rmb = $(this).val();
    $("#orderFees").text(parseFloat(rmb / temp_btc_value).toFixed(8));
  });
})
