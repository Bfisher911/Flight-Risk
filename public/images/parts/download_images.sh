#!/bin/bash
# Download product images from GetFPV CDN

# Goggles and Radios
curl -L -o jumper-t20s.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/j/u/jumper-t20s-radio-transmitter-elrs-_1_.jpg" &
curl -L -o radiolink-at10ii.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/r/a/radiolink-at10ii-12-ch-transmitter-kit_1.jpg" &
curl -L -o skyzone-sky04x-pro.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/s/k/skyzone-sky04x-pro-oled-5.8ghz-fpv-goggles_1_.jpg" &
curl -L -o fatshark-hdo2-1.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/f/a/fat-shark-hdo2.1-fpv-goggles-_1_.jpg" &
wait

# Tools
curl -L -o pinecil-v2.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/p/i/pinecil-v2-smart-mini-portable-soldering-iron_3.jpg" &
curl -L -o isdt-q6-nano.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/i/s/isdt-q6-nano-300w-lipo-battery-balance-charger-_1_.jpg" &
curl -L -o ethix-tool-case.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/e/t/ethix-tool-case-by-mr-steele_2_.jpg" &
curl -L -o vifly-shortsaver-2.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/v/i/vifly-shortsaver-2-smart-smoke-stopper_1_.jpg" &
wait

curl -L -o vifly-whoopstor-v3.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/v/i/vifly-whoopstor-v3-1s-lipo-battery-charger_1_.jpg" &
curl -L -o ifixit-mako-driver-kit.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/i/f/ifixit-mako-driver-kit---64-precision-bits_1_.jpg" &
curl -L -o tbs-ethix-m3-nut-driver.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/t/b/tbs-ethix-m3-nut-driver_1_.jpg" &
curl -L -o flywoo-fpv-multimeter.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/f/l/flywoo-fpv-multimeter_1_.jpg" &
wait

# Gear and Cases
curl -L -o torvol-quad-pitstop-backpack-pro.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/t/o/torvol-quad-pitstop-backpack-pro_1_.jpg" &
curl -L -o torvol-urban-carrier.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/t/o/torvol-urban-carrier-backpack_4_.jpg" &
curl -L -o lykus-dcp-m100-case.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/l/y/lykus-dcp-m100-case-for-dji-mavic-mini_1_.jpg" &
curl -L -o betafpv-storage-case.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/b/e/betafpv-micro-whoop-storage-case_1_.jpg" &
wait

# Batteries
curl -L -o cnhl-black-series-1300mah-6s.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/c/n/cnhl-black-series-1300mah-6s-100c-lipo-battery_1_.jpg" &
curl -L -o tattu-r-line-v5-1400mah-6s.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/t/a/tattu-r-line-version-5.0-1400mah-6s-150c-lipo-battery_1_.jpg" &
curl -L -o gnb-450mah-1s.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/g/n/gnb-450mah-1s-80c-lipo-battery_1_.jpg" &
curl -L -o gemfan-vanover-gate.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/g/e/gemfan-vanover-pop-up-race-gate_1_.jpg" &
wait

# Accessories
curl -L -o vibes-fpv-earbuds.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/v/i/vibes-fpv-earbuds_1_.jpg" &
curl -L -o ethix-neck-strap.png "https://cdn-v2.getfpv.com/media/catalog/product/cache/6305596479836c3bfef8b369c2d05576/e/t/ethix-comfort-neck-strap_1_.jpg" &
wait

echo "Download complete!"
ls -la *.png | tail -30
