import Image from "next/image";
import Link from "next/link";
import type { HeaderContacts, NavigationItem } from "@/types/site";
import type { ProjectImage } from "@/types/projects";
import type { ProjectsShowcaseContent } from "@/types/home";
import header from "@/components/layout/Header.module.css";
import gallery from "@/components/projects/ProjectGallery.module.css";
import showcase from "@/components/sections/ProjectsShowcase.module.css";

// Static authoring only: all behavior belongs to the CMS Managed Interactions runtime.
const modal = { "data-cms-modal": "true", "data-cms-open": "false", "data-cms-outside-close": "true", "data-cms-scroll-lock": "true" };
const swipe = (ratio: string) => ({ "data-cms-swipe": "true", "data-cms-swipe-interactive": "true", "data-cms-swipe-distance": "52", "data-cms-swipe-ratio": ratio, "data-cms-swipe-duration": "0" });
function Arrow({ left = false }: { left?: boolean }) {
  return <span className={`abat-arrow${left ? " abat-arrow-left" : ""}`} aria-hidden="true"><span /></span>;
}
function Close() { return <span className="abat-close-icon" aria-hidden="true" />; }
function Owner({ id, count, reset }: { id: string; count: number; reset?: string }) {
  return <div id={id} data-cms-selection="" data-cms-count={String(count)} data-cms-index="0" data-cms-wrap="true" data-cms-reset-on={reset} />;
}
function Step({ owner, direction, className, label }: { owner: string; direction: "previous" | "next"; className: string; label: string }) {
  return <button type="button" className={className} data-cms-selection-action={direction} data-cms-target={owner} aria-label={label}><Arrow left={direction === "previous"} /></button>;
}

export function MobileNavigation({ homeLink, navigation, services, secondaryNavigation, contacts }: {
  homeLink: NavigationItem; navigation: readonly NavigationItem[]; services: readonly NavigationItem[];
  secondaryNavigation: readonly NavigationItem[]; contacts: HeaderContacts;
}) {
  const link = (item: NavigationItem, className: string) => item.isPlaceholder
    ? <span key={item.label} className={`${className} ${header.mobilePlaceholderLink}`} aria-disabled="true">{item.label}</span>
    : <Link key={item.label} href={item.href} className={className} data-cms-action="close" data-cms-target="mobile-navigation">{item.label}</Link>;
  return <div className={header.mobileNavigation}>
    <button type="button" className={header.menuButton} aria-label="Открыть полное меню" data-cms-action="open" data-cms-target="mobile-navigation">
      <span className={header.menuIcon} aria-hidden="true"><span /><span /><span /></span>
    </button>
    <div id="mobile-navigation" className={header.dialog} {...modal} data-cms-dismiss-at="1200" aria-labelledby="mobile-navigation-title">
      <div className={header.mobilePanel}>
        <div className={header.mobilePanelHeader}>
          {contacts.phoneHref ? <a href={contacts.phoneHref} className={header.mobilePhone}>{contacts.phone}</a> : <span className={header.mobilePhone} aria-disabled="true">{contacts.phone}</span>}
          <button type="button" className={header.closeButton} aria-label="Закрыть меню" data-cms-action="close" data-cms-target="mobile-navigation"><span aria-hidden="true">×</span></button>
        </div>
        <span id="mobile-navigation-title" className={header.mobileTitle}>Меню</span>
        <nav className={header.mobileMenu} aria-label="Полное меню сайта">
          {link(homeLink, header.mobileHomeLink)}
          <section className={header.mobileSection} aria-labelledby="mobile-construction-title">
            <h2 id="mobile-construction-title" className={header.mobileSectionTitle}>Строительство</h2>
            <div className={header.mobileSectionLinks}>{navigation.map(item => link(item, header.mobileSubLink))}</div>
          </section>
          <section className={header.mobileSection} aria-labelledby="mobile-services-title">
            <h2 id="mobile-services-title" className={header.mobileSectionTitle}>Услуги</h2>
            <div className={header.mobileSectionLinks}>{services.map(item => link(item, header.mobileSubLink))}</div>
          </section>
          <div className={header.mobileStandaloneLinks}>{secondaryNavigation.map(item => link(item, header.mobileStandaloneLink))}</div>
        </nav>
        <div className={header.mobileContacts}>
          <span className={header.mobileLocation}>{contacts.location}</span>
          <div className={header.mobileMessengers}>{contacts.messengers.map(item => item.href ? <a key={item.label} href={item.href}>{item.label}</a> : <span key={item.label} aria-disabled="true">{item.label}</span>)}</div>
        </div>
      </div>
    </div>
  </div>;
}

function Thumbnails({ owner, images, title, styles, detail = false }: { owner: string; images: readonly ProjectImage[]; title: string; styles: Record<string, string>; detail?: boolean }) {
  return <div className={styles.thumbnails} role="group" aria-label={detail ? "Выбор фотографии" : "Фотографии объекта"} data-cms-selection-view={owner}>
    {images.map((image, index) => <button type="button" key={image.src} className={styles.thumbnailButton} data-cms-selection-action="select" data-cms-target={owner} data-cms-index={String(index)} aria-label={detail ? `Показать фото ${index + 1}: ${image.alt}` : `Показать фото ${index + 1} объекта «${title}»`}>
      <Image src={image.src} alt="" fill className={styles.thumbnailImage} />
    </button>)}
  </div>;
}
function Lightbox({ id, owner, images, title, styles, detail = false }: { id: string; owner: string; images: readonly ProjectImage[]; title: string; styles: Record<string, string>; detail?: boolean }) {
  return <div id={id} className={styles.lightboxBackdrop} {...modal} aria-label={`Фотографии объекта «${title}»`} data-cms-selection-view={owner} data-cms-keyboard="true">
    <div className={styles.lightboxContent}>
      <div className={styles.lightboxHeader}>
        <span>{images.map((image, index) => <span key={image.src} data-cms-item={String(index)}>{title} · {index + 1} / {images.length}</span>)}</span>
        <button type="button" className={styles.lightboxClose} data-cms-action="close" data-cms-target={id} aria-label="Закрыть просмотр фотографий"><Close /></button>
      </div>
      <div className={styles.lightboxImageFrame} data-cms-selection-view={owner} data-cms-keyboard="true" {...(detail ? swipe("1") : {})}>
        {images.map((image, index) => <Image key={image.src} data-cms-item={String(index)} src={image.src} alt={image.alt} fill className={styles.lightboxImage} />)}
        <Step owner={owner} direction="previous" className={`${styles.lightboxArrow} ${styles.lightboxArrowPrevious}`} label="Предыдущее фото" />
        <Step owner={owner} direction="next" className={`${styles.lightboxArrow} ${styles.lightboxArrowNext}`} label="Следующее фото" />
      </div>
    </div>
  </div>;
}
export function ProjectGallery({ projectTitle, images }: { projectTitle: string; images: readonly ProjectImage[] }) {
  if (!images.length) return null;
  const owner = "abat-gallery-photos", box = "abat-gallery-lightbox";
  return <section className={gallery.gallery} aria-label={`Фотографии объекта «${projectTitle}»`}>
    <Owner id={owner} count={images.length} />
    <div className={gallery.mainImageFrame} data-cms-selection-view={owner} data-cms-keyboard="true">
      <button type="button" className={gallery.mainImageButton} data-cms-action="open" data-cms-target={box}>
        <span className="abat-visually-hidden">Открыть фото: </span>
        {images.map((image, index) => <Image key={image.src} data-cms-item={String(index)} src={image.src} alt={image.alt} fill className={gallery.mainImage} preload={index === 0} />)}
      </button>
      <Step owner={owner} direction="previous" className={`${gallery.coverArrow} ${gallery.coverArrowPrevious}`} label="Предыдущее фото в галерее" />
      <Step owner={owner} direction="next" className={`${gallery.coverArrow} ${gallery.coverArrowNext}`} label="Следующее фото в галерее" />
    </div>
    <Thumbnails owner={owner} images={images} title={projectTitle} styles={gallery} detail />
    <Lightbox id={box} owner={owner} images={images} title={projectTitle} styles={gallery} detail />
  </section>;
}
export function ProjectsShowcase({ content }: { content: ProjectsShowcaseContent }) {
  const projects = "abat-showcase-projects";
  return <section className={showcase.section} aria-labelledby="projects-showcase-title">
    <Owner id={projects} count={content.projects.length} />
    {content.projects.map(project => <Owner key={project.id} id={`abat-showcase-photos-${project.id}`} count={project.images.length} reset={projects} />)}
    <div className="container">
      <div className={showcase.heading}><span className={showcase.headingAccent} aria-hidden="true" /><h2 id="projects-showcase-title" className={showcase.title}>{content.title}</h2></div>
      <div data-cms-selection-view={projects}>
        {content.projects.map((project, index) => {
          const owner = `abat-showcase-photos-${project.id}`, box = `abat-showcase-lightbox-${project.id}`;
          return <article key={project.id} className={showcase.showcase} data-cms-item={String(index)}>
            <div className={showcase.infoPanel}>
              <div className={showcase.numberRow}><span className={showcase.projectNumber}>{project.number}</span><span className={showcase.progress}>{project.number} / {String(content.projects.length).padStart(2, "0")}</span></div>
              <div className={showcase.projectDetails}>
                <h3 className={showcase.projectTitle}>{project.title}</h3><p className={showcase.summary}>{project.summary}</p>
                <dl className={showcase.details} aria-label="Характеристики объекта">{project.details.slice(0, 3).map(detail => <div className={showcase.detail} key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>
              </div>
            </div>
            <div className={showcase.mediaPanel}>
              <button type="button" className={showcase.mainImageButton} data-cms-action="open" data-cms-target={box} data-cms-selection-view={projects} data-cms-keyboard="true" {...swipe("1.25")} aria-label={`Открыть фото объекта «${project.title}»`}>
                {/* Hit testing stays on the stable swipe button, not its nested photo view. */}
                <span className="abat-photo-presentation" data-cms-selection-view={owner}>{project.images.map((image, photo) => <Image key={image.src} data-cms-item={String(photo)} src={image.src} alt={image.alt} fill className={showcase.mainImage} preload={index === 0 && photo === 0} />)}</span>
              </button>
              <Step owner={projects} direction="next" className={showcase.nextProjectButton} label="Следующий объект" />
              <Thumbnails owner={owner} images={project.images} title={project.title} styles={showcase} />
            </div>
          </article>;
        })}
      </div>
      <div className={showcase.allProjectsRow}><Link href={content.allProjectsHref} className={showcase.allProjectsLink}><span>Все построенные объекты</span><Arrow /></Link></div>
    </div>
    {content.projects.map(project => <Lightbox key={project.id} id={`abat-showcase-lightbox-${project.id}`} owner={`abat-showcase-photos-${project.id}`} images={project.images} title={project.title} styles={showcase} />)}
  </section>;
}
