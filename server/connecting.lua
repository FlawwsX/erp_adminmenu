local banCheck = true

if banCheck then
    AddEventHandler("playerConnecting", function(name, setKickReason, d)
        local source = source
        d.defer()
	    Wait(0) -- Needed
	    d.update("Hi there, "..name.."! We're just checking your ban status, we won't be long!")

        local steamid  = "Unidentified"
        local license  = "Unidentified"
        local discord  = "Unidentified"
        local ip       = "Unidentified"
        local fivem    = "Unidentified"
    
        for k,v in pairs(GetPlayerIdentifiers(source))do            
            if string.sub(v, 1, string.len("steam:")) == "steam:" then
                steamid = v
            elseif string.sub(v, 1, string.len("license:")) == "license:" then
                license = v
            elseif string.sub(v, 1, string.len("ip:")) == "ip:" then
                ip = v
            elseif string.sub(v, 1, string.len("discord:")) == "discord:" then
                discord = v
            elseif string.sub(v, 1, string.len("fivem:")) == "fivem:" then
                fivem = v
            end
        end

        Wait(500)

        local bans, isBanned, isPerma = exports['erp_adminmenu']:Bans(), false, false
        local banId, reason, nickname, timeRemaining

        local function PresentBanCard()
            local message = "You are banned from this server."
            if isPerma then
                message = message.."\n\n📌 Ban ID: "..banId.."\n🧾 Nickname: "..nickname.."\n⏱ Time Remaining (secs): "..math.ceil(timeRemaining).." (Permanent)\n📜 Reason: "..reason
            else
                message = message.."\n\n📌 Ban ID: "..banId.."\n🧾 Nickname: "..nickname.."\n⏱ Time Remaining (secs): "..math.ceil(timeRemaining).."\n📜 Reason: "..reason
            end
            Wait(0)
            d.done(message)
        end

        for i=1, #bans do
            local BanInfo = bans[i]
            if BanInfo.steamid == steamid or BanInfo.discord == discord or BanInfo.license == license or BanInfo.ip == ip or BanInfo.fivem == fivem then
                if tonumber(BanInfo.date) == 69 then 
                    isPerma, isBanned, banId, reason, nickname, timeRemaining = true, true, BanInfo['id'], BanInfo['reason'], BanInfo['name'], 69
                    PresentBanCard()
                    return
                elseif BanInfo.date - os.time() > 0 then
                    isBanned, banId = true, BanInfo.id
                    timeRemaining = BanInfo.date - os.time()
                    reason = BanInfo.reason
                    nickname = BanInfo.name
                    PresentBanCard()
                    return
                else
                    if GetResourceState("oxmysql") == "started" then
                        exports.oxmysql:execute("DELETE FROM bannedplayers WHERE id=:id", { id = BanInfo.id }, function(result) if result > 0 then exports['erp_adminmenu']:RefreshBans() end end)
                    elseif GetResourceState("mysql-async") == "started" then
                        MySQL.Async.execute("DELETE FROM bannedplayers WHERE id=@id", { id = BanInfo.id }, function(result) if result > 0 then exports['erp_adminmenu']:RefreshBans() end end)
                    end
                    break
                end
            end
        end
        
        d.done()
    end)
end

RegisterNetEvent('playerJoining', function()
    local source = source

    local steamid  = "Unidentified"
    local license  = "Unidentified"
    local discord  = "Unidentified"
    local ip       = "Unidentified"
    local fivem    = "Unidentified"

    for k,v in pairs(GetPlayerIdentifiers(source))do            
        if string.sub(v, 1, string.len("steam:")) == "steam:" then
            steamid = v
        elseif string.sub(v, 1, string.len("license:")) == "license:" then
            license = v
        elseif string.sub(v, 1, string.len("ip:")) == "ip:" then
            ip = v
        elseif string.sub(v, 1, string.len("discord:")) == "discord:" then
            discord = v
        elseif string.sub(v, 1, string.len("fivem:")) == "fivem:" then
            fivem = v
        end
    end
    
    local message = "Player: **"..GetPlayerName(source).."** (**"..source.."**)\nSteam: **"..steamid.."**".."\nFiveM: **"..fivem.."**\nLicense: **"..license.."**\nDiscord: **"..discord.."**\nIP: **||"..ip.."||**"
    sendToDiscord('Player Connecting', message, "2676322", GetConvar("discordWebhook", ""))
end)

AddEventHandler('playerDropped', function(reason)
    local source = source
    local steamid  = "Unidentified"
    local license  = "Unidentified"
    local discord  = "Unidentified"
    local ip       = "Unidentified"
    local fivem    = "Unidentified"

    for k,v in pairs(GetPlayerIdentifiers(source))do            
        if string.sub(v, 1, string.len("steam:")) == "steam:" then
            steamid = v
        elseif string.sub(v, 1, string.len("license:")) == "license:" then
            license = v
        elseif string.sub(v, 1, string.len("ip:")) == "ip:" then
            ip = v
        elseif string.sub(v, 1, string.len("discord:")) == "discord:" then
            discord = v
        elseif string.sub(v, 1, string.len("fivem:")) == "fivem:" then
            fivem = v
        end
    end

    local message = "Player: **"..GetPlayerName(source).."** (**"..source.."**)\nReason: **"..reason.."**\nSteam: **"..steamid.."**".."\nFiveM: **"..fivem.."**\nLicense: **"..license.."**\nDiscord: **"..discord.."**\nIP: **||"..ip.."||**"
    sendToDiscord('Player Leaving', message, "15730953", GetConvar("discordWebhook", ""))
end)