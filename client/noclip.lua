local config = {
	speeds = {
			{ label = "Very Slow", speed = 0},
			{ label = "Slow", speed = 0.5},
			{ label = "Normal", speed = 2},
			{ label = "Fast", speed = 4},
			{ label = "Very Fast", speed = 6},
			{ label = "Extremely Fast", speed = 10},
			{ label = "Extremely Fast v2.0", speed = 20},
			{ label = "Max Speed", speed = 25}
	}
}

local yayeetActive = false -- [[Wouldn't touch this.]]
local index = 1 -- [[Used to determine the index of the speeds table.]]
local yayeetEntity = nil

CreateThread(function()

	local currentSpeed = config.speeds[index].speed

	while true do
			Wait(0)

			if yayeetActive then

					local yoff, zoff = 0.0, 0.0

					if not IsPauseMenuActive() then
							if IsDisabledControlJustPressed(0, 21) then
									if index ~= 8 then
											index = index+1
											currentSpeed = config.speeds[index].speed
									else
											currentSpeed = config.speeds[1].speed
											index = 1
									end
									if GetResourceState('mythic_notify') == 'started' then
										exports['mythic_notify']:SendAlert('inform', 'New Speed: '..config.speeds[index]["label"])
									end
							end

							if IsDisabledControlPressed(0, 32) then
									yoff = 0.5
							end
							
							if IsDisabledControlPressed(0, 33) then
									yoff = -0.5
							end
							
							if IsDisabledControlPressed(0, 34) then
									SetEntityHeading(yayeetEntity, GetEntityHeading(yayeetEntity)+3)
							end
							
							if IsDisabledControlPressed(0, 35) then
									SetEntityHeading(yayeetEntity, GetEntityHeading(yayeetEntity)-3)
							end
							
							if IsDisabledControlPressed(0, 85) then
									zoff = 0.2
							end
							
							if IsDisabledControlPressed(0, 48) then
									zoff = -0.2
							end
					end
					
					if yoff ~= 0.0 or zoff ~= 0.0 then
							SetEntityCoordsNoOffset(yayeetEntity, GetOffsetFromEntityInWorldCoords(yayeetEntity, 0.0, yoff * (currentSpeed + 0.3), zoff * (currentSpeed + 0.3)), yayeetActive, yayeetActive, yayeetActive)
					end

					SetEntityVisible(yayeetEntity, false, false)
					SetLocalPlayerVisibleLocally(true)
					SetEntityAlpha(yayeetEntity, 50, false)
			else
					Wait(50)
			end
	end
end)

RegisterNetEvent("erp_adminmenu:toggleyayeet")
AddEventHandler("erp_adminmenu:toggleyayeet", function()
	yayeetActive = not yayeetActive 
	if IsPedInAnyVehicle(PlayerPedId(), false) then
			yayeetEntity = GetVehiclePedIsIn(PlayerPedId(), false)
	else
			yayeetEntity = PlayerPedId()
	end
	SetEntityVisible(yayeetEntity, not yayeetActive, 0)
	SetEntityCollision(yayeetEntity, not yayeetActive, not yayeetActive)
	FreezeEntityPosition(yayeetEntity, yayeetActive)
	SetEntityInvincible(yayeetEntity, yayeetActive)
	SetVehicleRadioEnabled(yayeetEntity, not yayeetActive)
	ResetEntityAlpha(yayeetEntity)
end)