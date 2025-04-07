local _ = require("gettext")
local Dispatcher = require("dispatcher") -- luacheck:ignore
local InfoMessage = require("ui/widget/infomessage")
local logger = require("logger")
local onUpload = require("upload")
local UIManager = require("ui/uimanager")
local WidgetContainer = require("ui/widget/container/widgetcontainer")
local KoInsightSettings = require("settings")

local KoInsight = WidgetContainer:extend{
    name = "koinsight",
    is_doc_only = false
}

function KoInsight:init()
    KoInsight.ui.menu:registerToMainMenu(KoInsight)

    KoInsight.koinsight_settings = KoInsightSettings:new{}
end

function KoInsight:addToMainMenu(menu_items)
    menu_items.koinsight = {
        text = _("KoInsight"),
        sorting_hint = "tools",
        sub_item_table = {{
            text = _("Configure KoInsight"),
            keep_menu_open = true,
            callback = function()
                KoInsight.koinsight_settings:editServerSettings()
            end
        }, {
            text = _("Synchronize"),
            separator = true,
            callback = function()
                onUpload(KoInsight.koinsight_settings.server_url)
            end
        }, {
            text = _("About KoInsight"),
            keep_menu_open = true,
            callback = function()
                UIManager:show(InfoMessage:new{
                    text = "KoInsight is a sync plugin for KoInsight instances. \nSee https://github.com/GeorgeSG/koinsight."
                })
            end
        }}
    }
end

return KoInsight
