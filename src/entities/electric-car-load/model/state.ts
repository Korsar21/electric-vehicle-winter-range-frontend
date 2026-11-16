import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { ElectricCarLoad } from './types';
import { electricCarLoadsApi, errorMessage } from '../../../shared/api/client';
import { mockLoads } from '../../../shared/data/mockLoads';
export type Load = ElectricCarLoad & {
    is_creator?: number;
    is_liked?: number;
    has_next?: boolean;
    status?: string;
};
export interface Filters {
    search: string;
    category: string;
    maxPower: string;
}
const emptyFilters: Filters = { search: '', category: '', maxPower: '' };
export const filtersSlice = createSlice({ name: 'electricCarLoadFilters', initialState: emptyFilters, reducers: { setFilters: (s, a: PayloadAction<Partial<Filters>>) => ({ ...s, ...a.payload }), resetFilters: () => emptyFilters } });
export const authSlice = createSlice({ name: 'auth', initialState: { isAuthenticated: false, name: '', userId: 0 }, reducers: { signedIn: (_, a: PayloadAction<{
            name: string;
            user_id: number;
        }>) => ({ isAuthenticated: true, name: a.payload.name, userId: a.payload.user_id }), signedOut: () => ({ isAuthenticated: false, name: '', userId: 0 }) } });
type State = {
    auth: ReturnType<typeof authSlice.reducer>;
    filters: Filters;
};
function isOffline(e: unknown) { return axios.isAxiosError(e) && (!e.response || e.response.status === 502 || e.response.status === 503); }
const api = electricCarLoadsApi.electricCarLoads;
export const getElectricCarLoads = createAsyncThunk('electricCarLoads/getList', async (_, t) => {
    const { filters, auth } = t.getState() as State;
    try {
        const r = await api.getElectricCarLoads({ search: filters.search, category: filters.category, maxPowerW: filters.maxPower === '' ? undefined : Number(filters.maxPower) });
        return { items: r.data as Load[], mock: false };
    }
    catch (e) {
        if (!auth.isAuthenticated && isOffline(e))
            return { items: mockLoads.filter(x => x.name.toLowerCase().includes(filters.search.toLowerCase()) && (!filters.category || x.category === filters.category) && (!filters.maxPower || x.power_draw_w <= Number(filters.maxPower))), mock: true };
        return t.rejectWithValue(errorMessage(e));
    }
});
export const getElectricCarLoadFeed = createAsyncThunk('electricCarLoads/getFeed', async (query: {
    id?: number;
    next?: boolean;
}, t) => {
    try {
        return { item: (await api.getElectricCarLoadFeed(query)).data as Load, mock: false };
    }
    catch (e) {
        if (!(t.getState() as State).auth.isAuthenticated && isOffline(e)) {
            let index = query.id ? mockLoads.findIndex(x => x.id === query.id) : 0;
            if (query.next)
                index++;
            return { item: mockLoads[index] ? { ...mockLoads[index], has_next: index < mockLoads.length - 1 } : null, mock: true };
        }
        if (axios.isAxiosError(e) && e.response?.status === 404)
            return { item: null, mock: false };
        return t.rejectWithValue(errorMessage(e));
    }
});
export const getElectricCarLoadDraft = createAsyncThunk('electricCarLoads/getDraft', async (_, t) => { try {
    return (await api.getElectricCarLoadDraft()).data as Load;
}
catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404)
        return null;
    return t.rejectWithValue(errorMessage(e));
} });
export const createElectricCarLoadDraft = createAsyncThunk('electricCarLoads/createDraft', async (data: {
    name: string;
    image: File;
    video: File;
}, t) => { try {
    return (await api.createElectricCarLoadDraft(data)).data as Load;
}
catch (e) {
    return t.rejectWithValue(errorMessage(e));
} });
export const publishElectricCarLoad = createAsyncThunk('electricCarLoads/publish', async (data: {
    id: number;
    description: string;
    category: string;
    power_draw_w: number;
    priority: string;
}, t) => { try {
    const { id, ...body } = data;
    return (await api.publishElectricCarLoad(id, body)).data as Load;
}
catch (e) {
    return t.rejectWithValue(errorMessage(e));
} });
export const deleteElectricCarLoad = createAsyncThunk('electricCarLoads/delete', async (id: number, t) => { try {
    await api.deleteElectricCarLoad(id);
    return id;
}
catch (e) {
    return t.rejectWithValue(errorMessage(e));
} });
export const setElectricCarLoadLike = createAsyncThunk('electricCarLoads/setLike', async (data: {
    id: number;
    like: number;
}, t) => { try {
    await api.setElectricCarLoadLike(data.id, { like: data.like });
    return (await api.getElectricCarLoadFeed({ id: data.id })).data as Load;
}
catch (e) {
    return t.rejectWithValue(errorMessage(e));
} });
interface LoadsState {
    items: Load[];
    feed: Load | null;
    draft: Load | null;
    pending: number;
    error: string | null;
    mock: boolean;
    listRequest: string;
    feedRequest: string;
}
const initialState: LoadsState = { items: [], feed: null, draft: null, pending: 0, error: null, mock: false, listRequest: '', feedRequest: '' };
export const loadsSlice = createSlice({ name: 'electricCarLoads', initialState, reducers: { clearLoads: () => initialState }, extraReducers: b => {
        b.addCase(getElectricCarLoads.pending, (s, a) => { s.listRequest = a.meta.requestId; }).addCase(getElectricCarLoadFeed.pending, (s, a) => { s.feedRequest = a.meta.requestId; });
        b.addCase(getElectricCarLoads.fulfilled, (s, a) => { if (s.listRequest === a.meta.requestId) {
            s.items = a.payload.items;
            s.mock = a.payload.mock;
        } });
        b.addCase(getElectricCarLoadFeed.fulfilled, (s, a) => { if (s.feedRequest === a.meta.requestId) {
            s.feed = a.payload.item;
            s.mock = a.payload.mock;
        } });
        b.addCase(getElectricCarLoadDraft.fulfilled, (s, a) => { s.draft = a.payload; });
        b.addCase(createElectricCarLoadDraft.fulfilled, (s, a) => { s.draft = a.payload; });
        b.addCase(publishElectricCarLoad.fulfilled, (s, a) => { s.draft = null; s.feed = a.payload; s.items.push(a.payload); });
        b.addCase(deleteElectricCarLoad.fulfilled, (s, a) => { s.items = s.items.filter(x => x.id !== a.payload); if (s.feed?.id === a.payload)
            s.feed = null; if (s.draft?.id === a.payload)
            s.draft = null; });
        b.addCase(setElectricCarLoadLike.fulfilled, (s, a) => { s.items = s.items.map(x => x.id === a.payload.id ? a.payload : x); if (s.feed?.id === a.payload.id)
            s.feed = a.payload; });
        b.addMatcher(a => a.type.startsWith('electricCarLoads/') && a.type.endsWith('/pending'), s => { s.pending++; s.error = null; });
        b.addMatcher(a => a.type.startsWith('electricCarLoads/') && (a.type.endsWith('/fulfilled') || a.type.endsWith('/rejected')), (s, a) => { s.pending = Math.max(0, s.pending - 1); if (a.type.endsWith('/rejected'))
            s.error = typeof (a as PayloadAction<unknown>).payload === 'string' ? (a as PayloadAction<string>).payload : 'Ошибка запроса'; });
    } });
export const { setFilters, resetFilters } = filtersSlice.actions;
export const { signedIn, signedOut } = authSlice.actions;
export const { clearLoads } = loadsSlice.actions;
