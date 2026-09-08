import Image from "next/image";
import Link from "next/link";
import type { HeaderContacts, NavigationItem } from "@/types/site";
import type { ProjectImage } from "@/types/projects";
import type { ProjectsShowcaseContent } from "@/types/home";
import header from "@/components/layout/Header.module.css";
import gallery from "@/components/projects/ProjectGallery.module.css";
import showcase from "@/components/sections/ProjectsShowcase.module.css";

// Export-only alternatives: every link and photo remains usable without JavaScript.
export function MobileNavigation({ homeLink, navigation, services, secondaryNavigation, contacts }: {
  homeLink: NavigationItem;
  navigation: readonly NavigationItem[];
  services: readonly NavigationItem[];
  secondaryNavigation: readonly NavigationItem[];
  contacts: HeaderContacts;
}) {
  const link = (item: NavigationItem) => item.isPlaceholder
    ? <span key={item.label} aria-disabled="true">{item.label}</span>
    : <Link key={item.label} href={item.href}>{item.label}</Link>;
  return (
    <div className={`${header.mobileNavigation} abat-mobile-menu`}>
      <div role="navigation" aria-label="Полное меню сайта" className="abat-menu-groups">
        <div>{link(homeLink)}{secondaryNavigation.map(link)}</div>
        <section><h2>Строительство</h2>{navigation.map(link)}</section>
        <section><h2>Услуги</h2>{services.map(link)}</section>
      </div>
      <div className="abat-menu-contacts">
        <span>{contacts.location}</span>
        {contacts.phoneHref ? <a href={contacts.phoneHref}>{contacts.phone}</a> : <span aria-disabled="true">{contacts.phone}</span>}
        {contacts.messengers.map(item => item.href
          ? <a key={item.label} href={item.href}>{item.label}</a>
          : <span key={item.label} aria-disabled="true">{item.label}</span>)}
      </div>
    </div>
  );
}

export function ProjectGallery({ projectTitle, images }: {
  projectTitle: string;
  images: readonly ProjectImage[];
}) {
  const first = images[0];
  if (!first) return null;
  return (
    <div className={gallery.gallery} aria-label={`Фотографии объекта «${projectTitle}»`}>
      <div className={gallery.mainImageFrame}>
        <a href={first.src} className={gallery.mainImageButton} aria-label={`Открыть фото объекта «${projectTitle}»`}>
          <Image src={first.src} alt={first.alt} fill className={gallery.mainImage} preload />
        </a>
      </div>
      <div className={gallery.thumbnails}>
        {images.map((image, i) => <a href={image.src} className={gallery.thumbnailButton} key={image.src}
          aria-label={`Открыть фото ${i + 1} объекта «${projectTitle}»`}>
          <Image src={image.src} alt={image.alt} fill className={gallery.thumbnailImage} />
        </a>)}
      </div>
    </div>
  );
}

export function ProjectsShowcase({ content }: { content: ProjectsShowcaseContent }) {
  return (
    <section className={showcase.section} aria-labelledby="projects-showcase-title">
      <div className="container">
        <div className={showcase.heading}>
          <span className={showcase.headingAccent} aria-hidden="true" />
          <h2 id="projects-showcase-title" className={showcase.title}>{content.title}</h2>
        </div>
        <div className="abat-showcase-links" role="navigation" aria-label={content.title}>
          {content.projects.map(project => <a href={`#showcase-${project.id}`} key={project.id}>{project.number}</a>)}
        </div>
        <div className="abat-showcase-track">
          {content.projects.map(project => <article id={`showcase-${project.id}`} className={showcase.showcase} key={project.id}>
            <div className={showcase.infoPanel}>
              <div className={showcase.numberRow}>
                <span className={showcase.projectNumber}>{project.number}</span>
                <span className={showcase.progress}>{project.number} / {String(content.projects.length).padStart(2, "0")}</span>
              </div>
              <div className={showcase.projectDetails}>
                <h3 className={showcase.projectTitle}><Link href={`/proekty/${project.slug}`}>{project.title}</Link></h3>
                <p className={showcase.summary}>{project.summary}</p>
                <dl className={showcase.details} aria-label="Характеристики объекта">
                  {project.details.slice(0, 3).map(detail => <div className={showcase.detail} key={detail.label}>
                    <dt>{detail.label}</dt><dd>{detail.value}</dd>
                  </div>)}
                </dl>
              </div>
            </div>
            <div className={showcase.mediaPanel}>
              <a href={project.images[0].src} className={showcase.mainImageButton} aria-label={`Открыть фото объекта «${project.title}»`}>
                <Image src={project.images[0].src} alt={project.images[0].alt} fill className={showcase.mainImage} />
              </a>
              <div className={showcase.thumbnails}>
                {project.images.map((image, i) => <a href={image.src} key={image.src} className={showcase.thumbnailButton}
                  aria-label={`Открыть фото ${i + 1} объекта «${project.title}»`}>
                  <Image src={image.src} alt={image.alt} fill className={showcase.thumbnailImage} />
                </a>)}
              </div>
            </div>
          </article>)}
        </div>
        <div className={showcase.allProjectsRow}>
          <Link href={content.allProjectsHref} className={showcase.allProjectsLink}>Все построенные объекты <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
