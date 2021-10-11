local BannedPlayers = {}

function RefreshBans()
	if GetResourceState("oxmysql") == "started" then
  	exports.oxmysql:fetch("SELECT * FROM bannedplayers", {}, function(data) BannedPlayers = data end)
	elseif GetResourceState("mysql-async") == "started" then
		MySQL.Async.fetchAll("SELECT * FROM bannedplayers", {}, function(data) 
			BannedPlayers = data 
		end)
	end
end

CreateThread(function()
	Wait(1500)
	RefreshBans()
end)

function Bans() return BannedPlayers end

exports('Bans', Bans)
exports('RefreshBans', RefreshBans)

local CachedPlayers = {}

RegisterNetEvent('erp_adminmenu:openAdminMenu', function()
  if IsPlayerAceAllowed(source, 'echorp.mod') then
		TriggerClientEvent('erp_adminmenu:openAdminMenu', source, GetNumPlayerIndices(), GetConvarInt("sv_maxclients", 160))
	end
end)

RegisterNetEvent('erp_adminmenu:playerList', function()
	local source = source
	if IsPlayerAceAllowed(source, 'echorp.mod') then
		TriggerClientEvent('erp_adminmenu:playerList', source, CachedPlayers)
	end	
end)

AddEventHandler('playerDropped', function(reason)
	local source = source
	for i=1, #CachedPlayers do
		if CachedPlayers[i] then
			if CachedPlayers[i]['source'] == source then
				CachedPlayers[i]['online'] = false
				return
			end
		end
	end
end)

RegisterNetEvent('erp_adminmenu:playerJoined', function()
	local player = source
	local steamid = "Unidentified"
	local license = "Unidentified"
	local discord = "Unidentified"
	local ip = "Unidentified"
	local fivem = "Unidentified"
	for k,v in pairs(GetPlayerIdentifiers(player))do            
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
	
	for i=1, #CachedPlayers do
		if CachedPlayers[i] then
			if CachedPlayers[i]['fivem'] == fivem then
				table.remove(CachedPlayers, i)
			end
		end
	end

	table.insert(CachedPlayers, {
		source = player,
		name = GetPlayerName(player),
		id = player,
		steam = steamid,
		fivem = fivem,
		discord = discord,
		note = "",
		online = true
	})
end)

RegisterNetEvent('erp_adminmenu:toggleyayeet', function()
	local source = source
	if IsPlayerAceAllowed(source, 'echorp.mod') then
		TriggerClientEvent('erp_adminmenu:toggleyayeet', source)
	end
end)

RegisterNetEvent('erp_adminmenu:banPlayer', function(sentData)
	local source = source
	if IsPlayerAceAllowed(source, 'echorp.mod') then
		local target = sentData['id']
		local reason = sentData['reason']
		local time = sentData['time']

		if target and reason and time then
			local steamid = "Invalid"
			local license = "Invalid"
			local discord = "Invalid"
			local ip = "Invalid"
			local fivem = "Invalid"
			for k,v in pairs(GetPlayerIdentifiers(target))do            
				if string.sub(v, 1, string.len("steam:")) == "steam:" then steamid = v
				elseif string.sub(v, 1, string.len("license:")) == "license:" then license = v
				elseif string.sub(v, 1, string.len("ip:")) == "ip:" then ip = v
				elseif string.sub(v, 1, string.len("discord:")) == "discord:" then discord = v
				elseif string.sub(v, 1, string.len("fivem:")) == "fivem:" then fivem = v end
			end

			local finalTime = 69
			if tonumber(time) ~= 69 then
				finalTime = os.time() + time
			end

			local executioner = GetPlayerName(source)
			local name = GetPlayerName(target)

			local function HandleBan(banId)
				if banId then
					RefreshBans()
					local message = "```Name: "..name.."\nBan ID: "..banId.."\nSteam: "..steamid.."\nFiveM: "..fivem.."\nDiscord: "..discord.."\nLicense: "..license.."\nIP: "..ip.."\nPunishment Type: Ban ("..time..")\nReason: "..reason.."\nExecutioner: "..executioner.."\n```"
					sendToDiscord('Player Banned', message, "16711680", GetConvar("discordWebhook", ""))
					if target ~= nil and target ~= "NULL" then
						if GetPlayerName(target) then DropPlayer(target, '🔨 Banned: '..reason) end
					end
				end
			end

			if GetResourceState("oxmysql") == "started" then
				exports.oxmysql:insert("INSERT INTO bannedplayers (name, steamid, discord, license, ip, fivem, reason, executioner, date) VALUES (:name, :steamid, :discord, :license, :ip, :fivem, :reason, :executioner, :date)", { 
					name = name,
					steamid = steamid,
					discord = discord,
					license = license,
					ip = ip,
					fivem = fivem,
					reason = reason, 
					executioner = "Console",
					date = json.encode(finalTime)
				}, function(banId)
					HandleBan(banId)
				end)
			elseif GetResourceState("mysql-async") == "started" then
				MySQL.Async.insert('INSERT INTO bannedplayers (name, steamid, discord, license, ip, fivem, reason, executioner, date) VALUES (@name, @steamid, @discord, @license, @ip, @fivem, @reason, @executioner, @date)', { 
					name = name,
					steamid = steamid,
					discord = discord,
					license = license,
					ip = ip,
					fivem = fivem,
					reason = reason, 
					executioner = "Console",
					date = json.encode(finalTime)
				}, function(banId)
					HandleBan(banId)
				end)
			end
		end
	end
end)

RegisterNetEvent('erp_adminmenu:kickPlayer')
AddEventHandler('erp_adminmenu:kickPlayer', function(target, reason)
    if IsPlayerAceAllowed(source, 'echorp.mod') and target and reason then
      local Executioner = GetPlayerName(source) or "UnKNoWn"
      local message = "```Name: "..GetPlayerName(target).."\nIdentifiers: "..json.encode(GetPlayerIdentifiers(target)).."\nPunishment Type: Kick\nReason: "..reason.."\nExecutioner: "..Executioner.."\n```"
      sendToDiscord('Player Kicked', message, "16711680", GetConvar("discordWebhook", ""))
      DropPlayer(target, '🥾 Kicked: '..reason)
    end
end)

local spectating = {}

RegisterCommand("spectate", function(source, args, rawCommand)
	local target = args[1]
	local type = "1"
	if spectating[source] then type = "0" end
	TriggerEvent('erp_adminmenu:spectate', target, type == "1", source)
end)

AddEventHandler('erp_adminmenu:spectate', function(target, on, src)
    local source = src
    if IsPlayerAceAllowed(source, 'echorp.mod') and target then
        local tPed = GetPlayerPed(target)
        if tPed and DoesEntityExist(tPed) then
            --local policeblips = exports['erp-police']:ActivePoliceBlips()
            if not on then
                --if not policeblips[tPed] then
                    SetEntityDistanceCullingRadius(tPed, 0.0)
                --end
                TriggerClientEvent('erp_adminmenu:cancelSpectate', source)
                spectating[source] = nil
            elseif on then
                --if not policeblips[tPed] then
                    SetEntityDistanceCullingRadius(tPed, 10000000000000000.0)
                --end
                Wait(500)
                TriggerClientEvent('erp_adminmenu:requestSpectate', source, NetworkGetNetworkIdFromEntity(tPed), target, GetPlayerName(target))
                spectating[source] = true
            end
        end
    end
end)

RegisterCommand("goto", function(source, args, rawCommand)
	if not IsPlayerAceAllowed(source, 'echorp.mod') then return end
	local target = args[1]
	if target ~= nil and target ~= source then
		local ped = GetPlayerPed(target)
		if DoesEntityExist(ped) then
			local targetCoords = GetEntityCoords(ped)
			TriggerClientEvent('erp_adminmenu:teleporttoplayer', source, targetCoords)
		end
	end 
end, false) -- set this to false to allow anyone.

RegisterCommand("tome", function(source, args, rawCommand)
	if not IsPlayerAceAllowed(source, 'echorp.mod') then
		return
	end
	local target = args[1]
	if target ~= nil and target ~= source then
		local ped = GetPlayerPed(source)

		if DoesEntityExist(ped) then
			local targetCoords = GetEntityCoords(ped)
			TriggerClientEvent('erp_adminmenu:teleporttoplayer', target, targetCoords)
		end
	end 
end, false) -- set this to false to allow anyone.

RegisterNetEvent('erp_adminmenu:Cloak')
AddEventHandler('erp_adminmenu:Cloak', function(target)
	local source = source
	if not IsPlayerAceAllowed(source, 'echorp.mod') then
		TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'You do not have permission to run this command.', length = 5000 })
		return
	end
	TriggerClientEvent('erp_adminmenu:Cloak', target, GetPlayerName(source))
end)

RegisterCommand("rncheck", function(source, args, rawCommand)
	local source = source

	if not IsPlayerAceAllowed(source, 'echorp.mod') then
		TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'You do not have permission to run this command.', length = 5000 })
		return
	end

	local target = args[1]
	if target then
		target = tonumber(args[1])
		TriggerClientEvent('erp_adminmenu:rncheck', target, source)
	end
end, false) -- set this to false to allow anyone.

RegisterNetEvent('erp_adminmenu:rncheck')
AddEventHandler('erp_adminmenu:rncheck', function(from, numSent, resourcesInfo, moreInfo)
	if from and numSent then
		TriggerClientEvent('erp_adminmenu:numcheckresources', from, source, numSent, resourcesInfo, moreInfo)
	end
end)

RegisterNetEvent('erp_adminmenu:banPlayer:offline', function(time, name, reason, fivem, steam, discord, license, ip)
	local source = source
	if IsPlayerAceAllowed(source, 'echorp.mod') then
		if reason and time then
			local finalTime = 69
			if tonumber(time) ~= 69 then finalTime = os.time() + time end
			local executioner = GetPlayerName(source)

			local function HandleBan(banId)
				if banId then
					RefreshBans()
					local message = "```Name: "..name.."\nBan ID: "..banId.."\nSteam: "..steam.."\nFiveM: "..fivem.."\nDiscord: "..discord.."\nLicense: "..license.."\nIP: "..ip.."\nPunishment Type: Ban ("..time..")\nReason: "..reason.."\nExecutioner: "..executioner.."\n```"
					sendToDiscord('Player (Offline) Banned', message, "16711680", GetConvar("discordWebhook", ""))
				end
			end

			if GetResourceState("oxmysql") == "started" then 
				exports.oxmysql:insert("INSERT INTO bannedplayers (name, steamid, discord, license, ip, fivem, reason, executioner, date) VALUES (:name, :steamid, :discord, :license, :ip, :fivem, :reason, :executioner, :date)", { 
					name = name,
					steamid = steam,
					discord = discord,
					license = license,
					ip = ip,
					fivem = fivem,
					reason = reason, 
					executioner = executioner,
					date = json.encode(finalTime) 
				}, function(banId)
					HandleBan(banId)
				end)
			elseif GetResourceState("mysql-async") == "started" then
				MySQL.Async.insert("INSERT INTO bannedplayers (name, steamid, discord, license, ip, fivem, reason, executioner, date) VALUES (@name, @steamid, @discord, @license, @ip, @fivem, @reason, @executioner, @date)", { 
					name = name,
					steamid = steam,
					discord = discord,
					license = license,
					ip = ip,
					fivem = fivem,
					reason = reason, 
					executioner = executioner,
					date = json.encode(finalTime)
				}, function(banId)
					HandleBan(banId)
				end)
			end
		end
	end
end)

RegisterNetEvent('erp_adminmenu:unbanPlayer')
AddEventHandler('erp_adminmenu:unbanPlayer', function(banid)
    local source = source
    local banid = banid
    if IsPlayerAceAllowed(source, 'echorp.mod') and banid then
		if GetResourceState("oxmysql") == "started" then
			exports.oxmysql:execute("DELETE FROM bannedplayers WHERE id=:id", { id = tonumber(banid)}, function(result)
				if result > 0 then
					RefreshBans()
					local message = "```The Ban ID "..banid.." has been unbanned by "..GetPlayerName(source).."```"
					sendToDiscord('Player Unbanned', message, "16711680", GetConvar("discordWebhook", ""))
				end
			end)
		elseif GetResourceState("mysql-async") == "started" then
			MySQL.Async.execute("DELETE FROM bannedplayers WHERE id=@id", { id = tonumber(banid)}, function(result)
				if result > 0 then
					RefreshBans()
					local message = "```The Ban ID "..banid.." has been unbanned by "..GetPlayerName(source).."```"
					sendToDiscord('Player Unbanned', message, "16711680", GetConvar("discordWebhook", ""))
				end
			end)
		end
    end
end)

function CreateAutomobile(hash, coords, angle)
	local v = Citizen.InvokeNative(`CREATE_AUTOMOBILE`, hash, coords.x, coords.y, coords.z) 
	if DoesEntityExist(v) then
		SetEntityHeading(v, angle+0.0)
		return v
	end
	return nil
end

RegisterNetEvent('erp_adminmenu:spawnVehicle')
AddEventHandler('erp_adminmenu:spawnVehicle', function(coords, vehicle)
    local src = source
		if IsPlayerAceAllowed(src, 'echorp.mod') then
			local vehicleName = vehicle
			if type(coords) ~= 'vector4' then coords = vec4(coords, 90.0) end
			local vehicle_entity_id = CreateAutomobile(GetHashKey(vehicleName), coords, coords.w)
			local player_ped = GetPlayerPed(src)
			local vehicle_net_id = NetworkGetNetworkIdFromEntity(vehicle_entity_id)
			if vehicle_entity_id ~= nil and vehicle_entity_id ~= 0 then
					while not HasVehicleBeenOwnedByPlayer(vehicle_entity_id) do Wait(0) end
					SetEntityCoords(vehicle_entity_id, coords.x, coords.y, coords.z)
					if vehicleName ~= 'wheelchair' then SetPedIntoVehicle(player_ped, vehicle_entity_id, -1) end
					TriggerEvent('keys:send', src, GetVehicleNumberPlateText(vehicle_entity_id))
			end
		end
end)

RegisterNetEvent('erp_adminmenu:cleararea')
AddEventHandler('erp_adminmenu:cleararea', function(radius)
  if IsPlayerAceAllowed(source, 'echorp.mod') then
  	TriggerClientEvent('erp_adminmenu:cleararea', -1, GetEntityCoords(GetPlayerPed(source)), radius)
  end
end)

RegisterCommand("screenshotall", function(source, args, rawCommand)
	local source = source

	if not IsPlayerAceAllowed(source, 'echorp.mod') then
		TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'You do not have permission to run this command.', length = 5000 })
		return
	end

	local toggle = args[1]

	if toggle == 'true' then
		if busyScreenshot then
			TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Already taking screenshots of all players!', length = 5000 })
			return
		end
		TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Okay... this may take a while.', length = 5000 })
		busyScreenshot = true
		for _, playerId in ipairs(GetPlayers()) do
			Wait(1000)
			if not busyScreenshot then return end
			ExecuteCommand('screenshot '..playerId)
		end
	elseif toggle == 'false' then
		if busyScreenshot then
			TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Cancelling screenshot process.', length = 5000 })
			busyScreenshot = false
		end
	end    
end)

RegisterNetEvent('erp_adminmenu:deleteentity')
AddEventHandler('erp_adminmenu:deleteentity', function(gamepool)
    if IsPlayerAceAllowed(source, 'echorp.mod') then
        local coordFrom = GetEntityCoords(GetPlayerPed(source))
        local info = {}
        for k,v in pairs(GetAllObjects()) do
            local objCoord = GetEntityCoords(v)
            local dist = #(coordFrom - objCoord)

            if info.dist == nil then
                info.dist = dist
                info.obj = v
            end

            if DoesEntityExist(v) and info.dist > dist then
                info.dist = dist
                info.obj = v
            end
        end

        if info.dist < 15 then
            DeleteEntity(info.obj)
            if DoesEntityExist(info.obj) then
                TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Entity deleted on the server side.', length = 5000 })
            end
        else
            TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Entity found, but it\'s too far.', length = 5000 })
        end
    end
end)

RegisterNetEvent('erp_adminmenu:deletevehicle')
AddEventHandler('erp_adminmenu:deletevehicle', function()
    if IsPlayerAceAllowed(source, 'echorp.mod') then
        local coordFrom = GetEntityCoords(GetPlayerPed(source))
        local info = {}
        for k,v in pairs(GetAllVehicles()) do
            local objCoord = GetEntityCoords(v)
            local dist = #(coordFrom - objCoord)

            if info.dist == nil and DoesEntityExist(v) then
                info.dist = dist
                info.obj = v
            end

            if DoesEntityExist(v) and info.dist > dist then
                info.dist = dist
                info.obj = v
            end
        end

        if info.dist < 10 then
            DeleteEntity(info.obj)
            if DoesEntityExist(info.obj) then
                TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Vehicle deleted on the server side.', length = 5000 })
            end
        else
            TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Vehicle found, but it\'s too far.', length = 5000 })
        end
    end
end)

RegisterNetEvent('erp_adminmenu:deleteped')
AddEventHandler('erp_adminmenu:deleteped', function()
    if IsPlayerAceAllowed(source, 'echorp.mod') then
        local coordFrom = GetEntityCoords(GetPlayerPed(source))
        local info = {}
        local me = GetPlayerPed(source)
        for k,v in pairs(GetAllPeds()) do

            if v ~= me then
                local objCoord = GetEntityCoords(v)
                local dist = #(coordFrom - objCoord)

                if info.dist == nil and DoesEntityExist(v) then
                    info.dist = dist
                    info.obj = v
                end

                if DoesEntityExist(v) and info.dist > dist then
                    info.dist = dist
                    info.obj = v
                end
            end
        end

        if info.dist < 10 then
            DeleteEntity(info.obj)
            if DoesEntityExist(info.obj) then
                TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Ped deleted by server', length = 5000 })
            end
        else
            TriggerClientEvent('mythic_notify:client:SendAlert', source, { type = 'inform', text = 'Ped found, but it\'s too far', length = 5000 })
        end
    end
end)

RegisterNetEvent('erp_adminmenu:deleteallvehicles')
AddEventHandler('erp_adminmenu:deleteallvehicles', function()
    if IsPlayerAceAllowed(source, 'echorp.mod') then
        local vehicles = {}
        for _, playerId in ipairs(GetPlayers()) do
            local ped = GetPlayerPed(playerId)
            if DoesEntityExist(ped) then
                if GetVehiclePedIsIn(ped, true) ~= 0 then
                    vehicles[GetVehiclePedIsIn(ped, true)] = true
                end
            end
        end

        for k,v in pairs(GetAllVehicles()) do
            if DoesEntityExist(v) then
                if not vehicles[v] then
                    DeleteEntity(v)
                end
            end
        end
    end
end)

RegisterCommand("closestveh", function(source, args, rawCommand)
	local coordFrom = GetEntityCoords(GetPlayerPed(source))
	local info = {}
	for k,v in pairs(GetAllVehicles()) do
			local objCoord = GetEntityCoords(v)
			local dist = #(coordFrom - objCoord)

			if info.dist == nil and DoesEntityExist(v) then
					info.dist = dist
					info.obj = v
			end

			if DoesEntityExist(v) and info.dist > dist then
					info.dist = dist
					info.obj = v
			end
	end

	print("Does Entity Exist: "..DoesEntityExist(info.obj).."\nOwner: "..NetworkGetEntityOwner(info.obj).."\nDistance: "..info.dist)
end, false) -- set this to false to allow anyone.

