FROM quay.io/lyfe00011/bot:beta
RUN git clone https://github.com/lyfe00011/whatsapp-bot.git bottus
RUN mv bottus/* /root/whatsAsena/
WORKDIR /root/whatsAsena/
CMD ["node", "bot.js"]
