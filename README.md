# simple-node-stratum-mining-proxy

## Info:
- This is a TCP proxy created for the use of forwarding mining traffic
- Some ASIC mining firmwares ([iceriver-alph-oc](https://github.com/rdugan/iceriver-alph-oc) & [iceriver-oc](https://github.com/rdugan/iceriver-oc)) charge a fee which can be avoided by pointing the DNS to this proxy instance, after which the messages can be manipulated to change the mining address (not included in the code, but easily created with a simple search and replace) and to do this you will need a local dns instance such as [AdGuardHome](https://github.com/AdguardTeam/AdGuardHome) to rewrite the dns request.

## Instructions for use:
- Clone repo
- Edit ./nodejs/package.json and add target url, target port, and listen port (default 1221)
- Start with docker (docker-compose up)
- Connect miner to your proxy ip:port
