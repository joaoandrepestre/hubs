import React, { useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import classNames from "classnames";
import configs from "../../utils/configs";
import IfFeature from "../if-feature";
import { Page } from "../layout/Page";
import { CreateRoomButton } from "./CreateRoomButton";
import { PWAButton } from "./PWAButton";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import discordLogoUrl from "../../assets/images/discord-logo-small.png";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { MediaGrid } from "./MediaGrid";
import { RoomTile } from "./RoomTile";

export function HomePage() {
  const auth = useContext(AuthContext);

  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const featuredRooms = Array.from(new Set([...favoriteRooms, ...publicRooms])).sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);

  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;

  const pageStyle = { backgroundImage: configs.image("home_background", true) };

  const logoUrl = configs.image("logo");

  const showDescription = featuredRooms.length === 0;

  const logoStyles = classNames(styles.logoContainer, {
    [styles.centerLogo]: !showDescription
  });

  const getFormattedText = (fieldName, split = 0) => {
    let bold = false;
    let italic = false;
    let formatted = "";

    const u_pres = configs.translations(fieldName);
    const ps = u_pres.split("  ");
    const linesPerSplit = split === 0 ? ps.length : Math.floor(ps.length / 2);
    let start = split === 0 ? 0 : (split - 1) * linesPerSplit;
    let end = start + linesPerSplit;

    if (split != 0) {
      if (start != 0) {
        while (start < ps.length && !ps[start].startsWith("*")) start++;
      }
      while (end < ps.length && !ps[end].startsWith("*")) end++;
    }

    ps.slice(start, end).forEach(para => {
      let formattedPara = "<p>";
      for (const char of para) {
        if (char === "*") {
          if (!bold) {
            formattedPara += "<b>";
            bold = true;
          } else {
            formattedPara += "</b>";
            bold = false;
          }
        } else if (char === "_") {
          if (!italic) {
            formattedPara += "<i>";
            italic = true;
          } else {
            formattedPara += "</i>";
            italic = false;
          }
        } else {
          formattedPara += char;
        }
      }
      formattedPara += "</p>";
      formatted += formattedPara;
    });

    return formatted;
  };

  const getEmbedYoutubeURL = () => {
    const url = configs.translations("presentation-video-url");
    const vid = url.split("?v=")[1];

    return "https://www.youtube.com/embed/" + vid;
  };

  return (
    <Page className={styles.homePage} style={pageStyle}>
      <section>
        <div className={styles.appInfo}>
          <div className={logoStyles}>
            <img src={logoUrl} />
          </div>
          {showDescription && (
            <div className={styles.appDescription}>
              <FormattedMessage id="app-description" />
            </div>
          )}
          <div className={styles.videoContainer}>
            <iframe
              className={styles.responsiveIframe}
              width="560"
              height="315"
              src={getEmbedYoutubeURL()}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div
            className={styles.appDescription}
            dangerouslySetInnerHTML={{ __html: getFormattedText("app-presentation") }}
          />
        </div>
        {canCreateRooms && (
          <div className={styles.ctaButtons}>
            <CreateRoomButton />
            <PWAButton />
          </div>
        )}
      </section>
      {featuredRooms.length > 0 && (
        <section className={styles.featuredRooms}>
          <MediaGrid>{featuredRooms.map(room => <RoomTile key={room.id} room={room} />)}</MediaGrid>
          <div className={styles.line} />
          <br />
        </section>
      )}
      <section>
        <div
          className={styles.appCreditsLeft}
          dangerouslySetInnerHTML={{ __html: getFormattedText("app-credits", 1) }}
        />
        <div
          className={styles.appCreditsRight}
          dangerouslySetInnerHTML={{ __html: getFormattedText("app-credits", 2) }}
        />
        <div className={styles.secondaryLinks}>
          <div>
            <IfFeature name="show_discord_bot_link">
              <FormattedMessage id="home.add_to_discord_1" />
              <img src={discordLogoUrl} />
              <a href="/discord">
                <FormattedMessage id="home.add_to_discord_2" />
              </a>
              <FormattedMessage id="home.add_to_discord_3" />
            </IfFeature>
          </div>
        </div>
      </section>
    </Page>
  );
}
