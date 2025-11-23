FROM registry.access.redhat.com/ubi8/nodejs-18

USER root

WORKDIR /opt/app-root/src

# pupeteer
RUN dnf install -y \
    nss \
    nspr \
    atk \
    at-spi2-atk \
    cups-libs \
    libdrm \
    libXcomposite \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXtst \
    pango \
    alsa-lib \
    gtk3 \
    libxkbcommon \
    libXrandr \
    libwayland-client \
    libwayland-server \
    libgbm 

# ubi9
# RUN dnf install -y \
#     libSM \
#     libICE \
#     libXt \
#     libXrender \
#     libXinerama \
#     libdrm \
#     libxcb \
#     libX11 \
#     libXau \
#     libXdamage \
#     libXfixes \
#     libXxf86vm \
#     libxshmfence \
#     libxslt \
#     fontconfig

# ubi8
RUN dnf install -y \
    libSM \
    libICE \
    libXrender \
    libXext \
    libX11 \
    libXfixes \
    libXinerama \
    libxcb \
    libX11-xcb \
    libXau \
    libxshmfence \
    libXxf86vm \
    libxslt \
    fontconfig 

RUN dnf clean all

# pupeteer setup
COPY ./deps/chromium-linux.zip /tmp/chromium.zip
RUN mkdir -p /opt/chromium \
    && unzip /tmp/chromium.zip -d /opt/chromium \
    && rm /tmp/chromium.zip \
    && chmod -R 755 /opt/chromium

# lo setup
ENV LO_VERSION=25.8.3.2
ENV LO_FOLDER=LibreOffice_${LO_VERSION}_Linux_x86-64_rpm

COPY ./deps/LibreOffice_${LO_VERSION}_Linux_x86-64_rpm.tar.gz /tmp/libreoffice.tar.gz
RUN tar -xvf /tmp/libreoffice.tar.gz -C /tmp \
    && cd /tmp/${LO_FOLDER}/RPMS \
    && rpm -Uvh --nodeps --force *.rpm \
    && rm /tmp/libreoffice.tar.gz && rm -rf /tmp/${LO_FOLDER}

RUN ln -sf /opt/libreoffice25.8/program/soffice /usr/bin/soffice

# make directory output for pdf files
RUN mkdir -p /opt/pdf/output && chmod -R 755 /opt/pdf/output && chown -R 1001:0 /opt/pdf/output

# ------------------------------
COPY package*.json ./

ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN chown -R 1001:0 /opt/app-root/src && chmod -R g+rw /opt/app-root/src

USER 1001

RUN npm install

USER root
COPY . .
RUN chown -R 1001:0 /opt/app-root/src && chmod -R g+rw /opt/app-root/src

# RUN ldd /opt/chromium/chrome-linux/chrome

USER 1001
CMD ["npm", "start"]
