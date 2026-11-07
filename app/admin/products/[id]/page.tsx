'use client';
import {Suspense,useEffect,useState} from 'react';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminShell from '../../admin-shell';
import {adminApi,AdminApiError} from '../../admin-api';
import {productFields,type AdminProduct,type AdminMetadata,type EditableProduct,type ProductField,type Attribute} from '../../admin-types';

function ProductEditor() {
  const {id}=useParams<{id:string}>();
  const [bundle,setBundle]=useState<AdminProduct|null>(null);const [draft,setDraft]=useState<EditableProduct|null>(null);
  const [metadata,setMetadata]=useState<AdminMetadata|null>(null);const [resets,setResets]=useState<ProductField[]>([]);
  const [busy,setBusy]=useState(false);const [uploading,setUploading]=useState(false);const [error,setError]=useState('');const [status,setStatus]=useState('');const [conflict,setConflict]=useState(false);
  useEffect(()=>{const abort=new AbortController();Promise.all([adminApi<AdminProduct>('products/'+id,{signal:abort.signal}),adminApi<AdminMetadata>('metadata',{signal:abort.signal})]).then(([product,meta])=>{if(!abort.signal.aborted){setBundle(product);setDraft(structuredClone(product.product));setMetadata(meta);}}).catch(e=>{if(!abort.signal.aborted)setError(e.message);});return()=>abort.abort();},[id]);
  const dirty=!!bundle&&!!draft&&(resets.length>0||productFields.some(key=>JSON.stringify(draft[key])!==JSON.stringify(bundle.product[key])));
  useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);

  function change<K extends ProductField>(key:K,value:EditableProduct[K]) {
    setDraft(current=>current?{...current,[key]:value}:current);setResets(current=>current.filter(field=>field!==key));setStatus('');
  }
  function resetField(key:ProductField) {
    if(!bundle)return;
    let fields:ProductField[]=[key];
    if(draft&&metadata&&(key==='brandSlug'||key==='collectionKeys')) {
      const brand=key==='brandSlug'?bundle.source.brandSlug:draft.brandSlug;
      const keys=key==='collectionKeys'?bundle.source.collectionKeys:draft.collectionKeys;
      if(keys.some(k=>metadata.collections.find(c=>c.key===k)?.brandSlug!==brand)) {
        if(!window.confirm('Коллекции не соответствуют бренду. Вернуть и бренд, и коллекции к данным Odoo?'))return;
        fields=['brandSlug','collectionKeys'];
      }
    }
    setDraft(current=>{if(!current)return current;const next=structuredClone(current);for(const field of fields)Object.assign(next,{[field]:structuredClone(bundle.source[field])});return next;});
    setResets(current=>[...new Set([...current,...fields])]);setStatus('');
  }
  function label(key:ProductField,title:string) {
    const manual=!resets.includes(key)&&(bundle?.overriddenFields.includes(key)||JSON.stringify(draft?.[key])!==JSON.stringify(bundle?.product[key]));
    return <div className="admin-field-heading"><span>{title}</span>{manual&&<><small className="admin-edited">Правка Atelier</small><button type="button" className="admin-reset" onClick={()=>resetField(key)}>Вернуть из Odoo</button></>}</div>;
  }
  function updateAttribute(index:number,attribute:Attribute) {
    if(!draft)return;change('attributes',draft.attributes.map((a,i)=>i===index?attribute:a));
  }
  function updateSilhouette(value:string) {
    if(!draft)return;change('silhouette',value);
  }
  async function save() {
    if(!bundle||!draft)return;setBusy(true);setError('');setStatus('');setConflict(false);
    const cleaned={...draft,attributes:draft.attributes.map(a=>({name:a.name.trim(),values:a.values.map(v=>v.trim()).filter(Boolean)}))};
    const changes:Partial<EditableProduct>={};
    for(const key of productFields)if(!resets.includes(key)&&JSON.stringify(cleaned[key])!==JSON.stringify(bundle.product[key]))Object.assign(changes,{[key]:cleaned[key]});
    try {const data=await adminApi<AdminProduct>('products/'+id,{method:'PATCH',body:JSON.stringify({version:bundle.version,changes,reset:resets})});setBundle(data);setDraft(structuredClone(data.product));setResets([]);setStatus('Изменения сохранены');}
    catch(e){setError(e instanceof Error?e.message:'Не удалось сохранить');setConflict(e instanceof AdminApiError&&e.status===409);}
    finally{setBusy(false);}
  }
  async function reload() {
    if(dirty&&!window.confirm('Загрузить сохранённый товар? Несохранённые правки будут потеряны.'))return;
    try{const data=await adminApi<AdminProduct>('products/'+id);setBundle(data);setDraft(structuredClone(data.product));setResets([]);setError('');setConflict(false);}
    catch(e){setError(e instanceof Error?e.message:'Не удалось загрузить');}
  }
  async function upload(files:FileList|null) {
    if(!files||!draft)return;
    if(files.length+draft.images.length>30){setError('Можно добавить не более 30 фото');return;}
    setUploading(true);setError('');
    try{for(const file of Array.from(files)){if(file.size>8*1024*1024)throw new Error('Фото должно быть не больше 8 МБ');const body=new FormData();body.append('file',file);const data=await adminApi<{filename:string}>('media',{method:'POST',body});setDraft(current=>current?{...current,images:[...new Set([...current.images,data.filename])]}:current);setResets(current=>current.filter(f=>f!=='images'));}}
    catch(e){setError(e instanceof Error?e.message:'Не удалось загрузить фото');}
    finally{setUploading(false);}
  }
  function moveImage(index:number,step:number) {
    if(!draft)return;const images=[...draft.images];[images[index],images[index+step]]=[images[index+step],images[index]];change('images',images);
  }
  if(!bundle||!draft||!metadata)return <div role={error?'alert':'status'} className={error?'admin-error':''}>{error||'Загружаем товар…'}</div>;
  const collections=metadata.collections.filter(c=>c.brandSlug===draft.brandSlug);
  return <>
    <Link className="admin-back" href="/admin/products" onClick={e=>{if(dirty&&!window.confirm('Уйти без сохранения изменений?'))e.preventDefault();}}>← Все товары</Link>
    <div className="admin-page-title"><div><p className="admin-eyebrow">Товар #{bundle.id}</p><h1>{bundle.product.name}</h1></div>{bundle.product.visible?<Link href={'/products/'+bundle.slug} target="_blank">Открыть на сайте ↗</Link>:<span className="admin-badge">Скрыт с сайта</span>}</div>
    <div className="admin-editor-bar"><span className={dirty?'admin-unsaved':''}>{dirty?'Есть несохранённые изменения':'Все изменения сохранены'}</span><div><button type="button" disabled={!dirty||busy||uploading} onClick={()=>{setDraft(structuredClone(bundle.product));setResets([]);setError('');setStatus('');}}>Отменить</button><button type="button" className="admin-primary" disabled={!dirty||busy||uploading} onClick={save}>{busy?'Сохраняем…':'Сохранить изменения'}</button></div></div>
    {error&&<div className="admin-error" role="alert">{error}{conflict&&<button onClick={reload}>Загрузить актуальную версию</button>}</div>}
    {status&&<div className="admin-success" role="status">{status}</div>}
    <fieldset className="admin-editor-fields" disabled={busy||uploading}><div className="admin-editor-grid"><div>
      <section className="admin-panel"><h2>Основное</h2><label>{label('name','Название')}<input value={draft.name} onChange={e=>change('name',e.target.value)} maxLength={250}/></label><label>{label('sku','Артикул')}<input value={draft.sku??''} onChange={e=>change('sku',e.target.value||null)} maxLength={120}/></label><label>{label('description','Описание')}<textarea value={draft.description} onChange={e=>change('description',e.target.value)} rows={6} maxLength={20000}/></label><label>{label('silhouette','Силуэт')}<input value={draft.silhouette} onChange={e=>updateSilhouette(e.target.value)} maxLength={100}/></label></section>
      <section className="admin-panel"><h2>Бренд и коллекции</h2><label>{label('brandSlug','Бренд')}<select value={draft.brandSlug} onChange={e=>{change('brandSlug',e.target.value);change('collectionKeys',[]);}}>{metadata.brands.map(b=><option value={b.slug} key={b.slug}>{b.name}</option>)}</select></label>{label('collectionKeys','Коллекции')}<div className="admin-collection-options">{collections.map(c=><label key={c.key}><input type="checkbox" checked={draft.collectionKeys.includes(c.key)} onChange={e=>change('collectionKeys',e.target.checked?[...draft.collectionKeys,c.key]:draft.collectionKeys.filter(k=>k!==c.key))}/><span>{c.name}<small>{c.key.includes(':public:')?'Категория сайта':'Категория каталога'}</small></span></label>)}</div></section>
      <section className="admin-panel"><h2>Характеристики</h2><p className="admin-help">Размеры, цвета, ткани и другие свойства. Каждое значение вводите с новой строки.</p>{label('attributes','Свойства товара')}
        {draft.attributes.map((a,index)=><div className="admin-attribute" key={index}><label>Название<input value={a.name} maxLength={120} onChange={e=>updateAttribute(index,{...a,name:e.target.value})}/></label><label>Значения<textarea value={a.values.join('\n')} rows={Math.min(6,Math.max(2,a.values.length))} onChange={e=>updateAttribute(index,{...a,values:e.target.value.split('\n')})}/></label><button type="button" aria-label={'Удалить характеристику '+a.name} onClick={()=>change('attributes',draft.attributes.filter((_,i)=>i!==index))}>Удалить</button></div>)}
        <button type="button" onClick={()=>change('attributes',[...draft.attributes,{name:'',values:[]}])} disabled={draft.attributes.length>=60}>+ Добавить характеристику</button>
      </section>
    </div><aside><section className="admin-panel"><h2>Публикация</h2>{label('visible','Видимость')}<label className="admin-checkbox"><input type="checkbox" checked={draft.visible} onChange={e=>change('visible',e.target.checked)}/>Показывать на сайте</label><p className="admin-help">Ручные правки остаются в Atelier. Остальные поля обновляются при импорте.</p></section>
      <section className="admin-panel"><h2>Фотографии</h2>{label('images','Галерея')}<p className="admin-help">Первое фото — обложка. JPEG, PNG или WebP до 8 МБ. Удаление фото из карточки не удаляет файл из других товаров.</p><label className="admin-upload">{uploading?'Загружаем…':'+ Загрузить фотографии'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>{void upload(e.target.files);e.target.value='';}}/></label><div className="admin-photo-grid">{draft.images.map((image,index)=><div className="admin-photo" key={image}><Image src={'/api/admin/images/'+image} alt={'Фото '+(index+1)} width={220} height={290} unoptimized/>{index===0&&<span className="admin-photo-cover">Обложка</span>}<div><button type="button" aria-label={'Переместить фото '+(index+1)+' вверх'} disabled={index===0} onClick={()=>moveImage(index,-1)}>←</button><button type="button" aria-label={'Переместить фото '+(index+1)+' вниз'} disabled={index===draft.images.length-1} onClick={()=>moveImage(index,1)}>→</button><button type="button" onClick={()=>change('images',draft.images.filter((_,i)=>i!==index))}>Убрать</button></div></div>)}</div>{!draft.images.length&&<p className="admin-help">Фото пока нет.</p>}</section>
      <section className="admin-panel"><h2>Данные источника</h2><dl className="admin-source"><dt>ID Odoo</dt><dd>{bundle.id}</dd><dt>Вариантов в Odoo</dt><dd>{bundle.variantCount}</dd><dt>Последний импорт</dt><dd>{new Date(bundle.importedAt).toLocaleString('ru-RU')}</dd><dt>Ручных полей</dt><dd>{bundle.overriddenFields.length}</dd></dl><button type="button" disabled={!bundle.overriddenFields.length} onClick={()=>{if(window.confirm('Вернуть все поля к последним данным Odoo? Изменения применятся после сохранения.')){setDraft(structuredClone(bundle.source));setResets([...productFields]);}}}>Вернуть всю карточку из Odoo</button></section>
    </aside></div></fieldset><div className="admin-bottom-save"><button className="admin-primary" disabled={!dirty||busy||uploading} onClick={save}>{busy?'Сохраняем…':'Сохранить изменения'}</button></div>
  </>;
}
export default function AdminProductPage(){return <Suspense fallback={<p>Загружаем…</p>}><AdminShell><ProductEditor/></AdminShell></Suspense>;}
