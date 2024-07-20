/*
 * @Author: mulingyuer
 * @Date: 2024-07-11 15:25:52
 * @LastEditTime: 2024-07-17 16:29:53
 * @LastEditors: mulingyuer
 * @Description: auth types
 * @FilePath: \ease-change-backend\src\modules\auth\types.ts
 * 怎么可能会有bug！！！
 */

/** 微信公众号获取access_token参数 */
export interface WechatPublicAccessTokenParams {
	/** 微信公众号appid */
	appid: string;
	/** 微信公众号secret */
	secret: string;
	/** 前端获取的code */
	code: string;
	/** 授权类型，此处填写authorization_code */
	grant_type: "authorization_code";
}

/** 微信公众号获取access_token返回值 */
export type WechatPublicAccessTokenResponse =
	| WechatPublicAccessTokenSuccess
	| WechatAccessTokenError;

/** 微信公众号获取access_token成功返回值 */
export interface WechatPublicAccessTokenSuccess {
	/** 网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同 */
	access_token: string;
	/** access_token接口调用凭证超时时间，单位（秒） */
	expires_in: number;
	/** 用户刷新access_token */
	refresh_token: string;
	/** 用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID */
	openid: string;
	/** 用户授权的作用域，使用逗号（,）分隔 */
	scope: string;
	/** 是否为快照页模式虚拟账号，只有当用户是快照页模式虚拟账号时返回，值为1 */
	is_snapshotuser: number;
	/** 用户统一标识（针对一个微信开放平台账号下的应用，同一用户的 unionid 是唯一的），只有当scope为"snsapi_userinfo"时返回 */
	unionid: string;
}

/** 微信公众号获取access_token错误返回值 */
export interface WechatAccessTokenError {
	errcode: number;
	errmsg: string;
}

/** 微信小程序登录参数 */
export interface WechatMiniLoginParams {
	/** 小程序appid */
	appid: string;
	/** 小程序 secret */
	secret: string;
	/** 前端获取的code */
	js_code: string;
	/** 授权类型，此处只需填写 authorization_code */
	grant_type: "authorization_code";
}

/** 微信小程序登录返回值 */
export interface WechatMiniLoginResult {
	/** 会话密钥 */
	session_key: string;
	/** 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回 */
	unionid?: string;
	/** 用户唯一标识 */
	openid: string;
	/** 错误码 */
	errcode: number;
	/** 错误信息 */
	errmsg: string;
}

/** 微信公众号查询用户是否关注公众号参数 */
export interface WechatPublicUserSubscribeParams {
	/** 公众号的token */
	access_token: string;
	/** 用户openid */
	openid: string;
	/** 语言 */
	lang: "zh_CN";
}

/** 微信公众号查询用户是否关注公众号返回值 */
export type WechatPublicUserSubscribeResult =
	| WechatPublicUserSubscribeSuccess
	| WechatPublicUserSubscribeFail;

/** 微信公众号查询用户是否关注公众号成功 */
export interface WechatPublicUserSubscribeSuccess {
	/** 用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息 */
	subscribe: number;
	/** 用户的标识，对当前公众号唯一 */
	openid: string;
	/** 用户的语言，简体中文为zh_CN */
	language: string;
	/** 用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间 */
	subscribe_time: number;
	/** 只有在用户将公众号绑定到微信开放平台账号后，才会出现该字段。 */
	unionid: string;
	/** 公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注 */
	remark: string;
	/** 用户所在的分组ID（兼容旧的用户分组接口） */
	groupid: number;
	/** 用户被打上的标签ID列表 */
	tagid_list: number[];
	/** 返回用户关注的渠道来源 */
	subscribe_scene: string;
	/** 二维码扫码场景（开发者自定义） */
	qr_scene: number;
	/** 二维码扫码场景描述（开发者自定义） */
	qr_scene_str: string;
}

/** 微信公众号查询用户是否关注公众号失败 */
export interface WechatPublicUserSubscribeFail {
	/** 错误码 */
	errcode: number;
	/** 错误信息 */
	errmsg: string;
}

/** 微信公众号获取用户信息参数 */
export interface WechatPublicUserInfoParams {
	/** 用户token */
	access_token: string;
	/** 用户openid */
	openid: string;
	/** 语言 */
	lang: "zh_CN";
}

/** 微信公众号获取用户信息返回值 */
export type WechatPublicUserInfoResult = WechatPublicUserInfoSuccess | WechatPublicUserInfoFail;

/** 微信公众号获取用户信息成功 */
export interface WechatPublicUserInfoSuccess {
	/** 用户的唯一标识 */
	openid: string;
	/** 用户昵称 */
	nickname: string;
	/** 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知 */
	sex: number;
	/** 用户个人资料填写的省份 */
	province: string;
	/** 普通用户个人资料填写的城市 */
	city: string;
	/** 国家，如中国为CN */
	country: string;
	/** 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效 */
	headimgurl: string;
	/** 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） */
	privilege: string[];
	/** 只有在用户将公众号绑定到微信开放平台账号后，才会出现该字段 */
	unionid: string;
}

/** 微信公众号获取用户信息失败 */
export interface WechatPublicUserInfoFail {
	/** 错误码 */
	errcode: number;
	/** 错误信息 */
	errmsg: string;
}
